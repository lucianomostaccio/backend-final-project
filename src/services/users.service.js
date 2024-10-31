//crud user async functions, using user.model
import { User } from "../models/users.model.js";
import Logger from "../utils/logger.js";
import { ADMIN_SMS_NUMBER } from "../config/config.js";
import { createHash, decrypt, encrypt } from "../utils/hashing.js";

export class UsersService {
  constructor({ usersDao, productsDao, emailService, smsService, hashing }) {
    this.usersDao = usersDao;
    this.productsDao = productsDao;
    this.emailService = emailService;
    this.smsService = smsService;
    this.hashing = hashing;
  }

  async authenticate({ email, password }) {
    try {
      const user = await this.usersDao.readOne({ email });
      console.log("user obtained by authenticate in users.service:", user);
      if (!user) {
        console.log("user not found");
        const typedError = new Error("Auth error, user email not found");
        typedError["type"] = "FAILED_AUTHENTICATION";
        throw typedError;
      }
      if (!this.hashing.isValidPassword(password, user.password)) {
        console.log("invalid password");
        const typedError = new Error("Auth error, invalid password");
        typedError["type"] = "FAILED_AUTHENTICATION";
        throw typedError;
      }
      console.log("authenticated successfully");
      return user;
    } catch (error) {
      if (!error["type"]) {
        console.log("error type not found");
        error["type"] = "UNKNOWN_ERROR";
      }
      throw error;
    }
  }

  async addUser(userData) {
    console.log("entered addUser in users.service");
    try {
      if (userData.password) {
        userData.password = await this.hashing.createHash(userData.password);
      }
      delete userData.role;
      const user = new User(userData);
      console.log("user (before toPOJO):", user); // Inspect directly
      console.log("Data to be saved:", user.toPOJO()); // Examine after toPOJO
      await this.usersDao.create(user.toPOJO());

      console.log(
        "ADMIN SMS NUMBER RECEIVED AT USERS.SERVICE:",
        ADMIN_SMS_NUMBER
      ),
        await this.emailService.send(
          user.email,
          "welcome",
          "thanks for registering!"
        );
      await this.smsService.send({
        to: ADMIN_SMS_NUMBER,
        body: `new user: ${user.first_name} (${user.email})`,
      });
      return user;
    } catch (error) {
      const typedError = new Error(error.message);
      typedError["type"] = "INVALID_ARGUMENT";
      throw typedError;
    }
  }

  // Get user by email
  async getUserByEmail(email) {
    try {
      const user = await this.usersDao.readOne({ email });
      if (!user) {
        console.log("user not found in users.service");
        throw new Error("User not found");
      }
      return await user;
    } catch (error) {
      Logger.error(`Error retrieving user by email: ${error.message}`);
      throw new Error(`Error retrieving user: ${error.message}`);
    }
  }

  // Get user by id
  async getUserById(_id) {
    try {
      const user = await this.usersDao.readOne({ _id });
      console.log("user obtained by getUserById in users.service:", user);
      if (!user) {
        throw new Error("User not found");
      }
      return await user;
    } catch (error) {
      throw new Error(`Error retrieving user: ${error.message}`);
    }
  }

  async getAllUsers() {
    return await this.usersDao.readMany({});
  }

  // Update user by ID
  async updateUser(_id, updateFields) {
    console.log("user id obtained in updateUser in users.service", _id);
    try {
      const userToUpdate = await this.usersDao.readOne({ _id });
      console.log("user found to be updated:", userToUpdate);

      if (!userToUpdate) {
        Logger.warning("User not found for update");
        throw new Error("User not found");
      }

      // Ensure 'role' is included in updateFields and allowed to be updated
      // No changes needed if 'role' is already included

      const updatedUser = await this.usersDao.updateOne(
        { _id },
        { $set: updateFields },
        { new: true }
      );
      console.log("updated user fields in users.service:");
      console.log("User information updated");

      console.log("User information updated for user id:", {
        userId: updatedUser._id,
      });
      return await updatedUser;
    } catch (error) {
      Logger.error("Error updating user:", error);
      throw error;
    }
  }

  async updatePassword(userId, newPassword, token) {
    // Determine the correct user ID.
    let effectiveUserId = userId;
    if (token && !userId) {
      const decryptedData = await decrypt(token);
      effectiveUserId = decryptedData._id;
    }

    // If no userId could be determined, throw an error.
    if (!effectiveUserId) {
      throw new Error("User ID is not available");
    }

    // Hash the new password.
    const hashedPassword = await createHash(newPassword);

    // Update the user's password.
    const updatedUser = await this.usersDao.updateOne(
      { _id: effectiveUserId },
      { $set: { password: hashedPassword } },
      { new: true }
    );

    // Handle case where user is not found.
    if (!updatedUser) {
      throw new Error("User not found");
    }

    return updatedUser;
  }

  async resetPassword(user) {
    const token = await encrypt({ _id: user._id });

    await this.emailService.send(
      user.email,
      "Reset Password", // Subject
      `Please click the following link to reset your password: http://localhost:8080/confirmresetpass/${token}` // Message
    );
  }

  // Delete user by ID
  async deleteUser(_id) {
    try {
      const deletedUser = await this.usersDao.deleteOne({ _id });

      if (deletedUser) {
        console.log("User deleted:", deletedUser);
        return deletedUser;
      } else {
        Logger.warning("User not found for deletion");
        return null;
      }
    } catch (error) {
      Logger.error("Error deleting user:", error);
      throw error;
    }
  }

  async updateLastLogin(userId) {
    try {
      const updatedUser = await this.usersDao.updateOne(
        { _id: userId },
        { $set: { last_login: new Date() } },
        { new: true }
      );
      return updatedUser;
    } catch (error) {
      throw new Error(`Error updating last login: ${error.message}`);
    }
  }

  async clearInactiveUsers() {
    try {
      const inactiveUsers = await this.usersDao.readMany({
        last_login: { $lt: new Date(Date.now() - 48 * 60 * 60 * 1000) },
      });
      console.log("accounts with no login in last 48 hours:", inactiveUsers);
      const deletedUsers = [];

      for (const user of inactiveUsers) {
        await this.usersDao.deleteOne({ _id: user._id });
        console.log("deleted user:", user);
        await this.emailService.send(
          user.email,
          "inactive accout",
          "your account has been removed due to inactivity that lasted more than 48 hours"
        );
        deletedUsers.push(user);
      }

      return deletedUsers;
    } catch (error) {
      throw new Error(`Error clearing inactive users: ${error.message}`);
    }
  }
}
