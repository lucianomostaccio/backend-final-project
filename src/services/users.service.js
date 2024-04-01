//creates crud user async functions, using user.model
import { User } from "../models/users.model.js";
import Logger from "../utils/logger.js";
import { ADMIN_SMS_NUMBER } from "../config/config.js";
import { createHash } from "../utils/hashing.js";

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
      if (!user) {
        const typedError = new Error("Auth error");
        typedError["type"] = "FAILED_AUTHENTICATION";
        throw typedError;
      }
      if (!this.hashing.isValidPassword(password, user.password)) {
        const typedError = new Error("Auth error");
        typedError["type"] = "FAILED_AUTHENTICATION";
        throw typedError;
      }
      return user;
    } catch (error) {
      throw new Error(`Auth error: ${error.message}`);
    }
  }

  async addUser(userData) {
    Logger.debug("entered addUser in users.service");
    try {
      if(userData.password) {
        userData.password = await this.hashing.createHash(userData.password)
      }
      delete userData.role;
      const user = new User(userData);
      Logger.debug("user (before toPOJO):", user); // Inspect directly
      Logger.debug("Data to be saved:", user.toPOJO()); // Examine after toPOJO
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
      console.log("user obtained by getUserByEmail in users.service:", user);
      if (!user) {
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
    try {
      const userToUpdate = await this.usersDao.readOne({ _id });

      if (!userToUpdate) {
        Logger.warning("User not found for update");
        throw new Error("User not found");
      }

      // Object.assign(userToUpdate, updatedUser);

      const updatedUser = await this.usersDao.updateOne(
        { _id },
        { $set: updateFields },
        { new: true }
      );
      Logger.info("User information updated:", { userId: updatedUser._id });
      return updatedUser;
    } catch (error) {
      Logger.error("Error updating user:", error);
      throw error;
    }
  }

  async updatePassword(userId, newPassword) {
    const hashedPassword = createHash(newPassword);
    const updatedUser = await this.usersDao.updateOne(
      { _id: userId },
      { $set: { password: hashedPassword } },
      { new: true }
    );

    if (!updatedUser) {
      throw new Error("User not found");
    }
    return updatedUser;
  }

  // Delete user by ID
  async deleteUser(_id) {
    try {
      const deletedUser = await this.usersDao.deleteOne({ _id });

      if (deletedUser) {
        Logger.info("User deleted:", deletedUser);
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
}
