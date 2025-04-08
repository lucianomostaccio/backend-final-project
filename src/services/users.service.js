// User service implementation with CRUD operations
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
      Logger.debug("Authentication attempt for user:", email);

      if (!user) {
        Logger.warning("Authentication failed: User email not found");
        const typedError = new Error("Authentication error: User not found");
        typedError["type"] = "FAILED_AUTHENTICATION";
        throw typedError;
      }

      if (!this.hashing.isValidPassword(password, user.password)) {
        Logger.warning(
          "Authentication failed: Invalid password for user:",
          email
        );
        const typedError = new Error("Authentication error: Invalid password");
        typedError["type"] = "FAILED_AUTHENTICATION";
        throw typedError;
      }

      Logger.info("User authenticated successfully:", email);
      return user;
    } catch (error) {
      if (!error["type"]) {
        Logger.error("Untyped error in authentication:", error);
        error["type"] = "UNKNOWN_ERROR";
      }
      throw error;
    }
  }

  async addUser(userData) {
    Logger.debug("Creating new user");
    try {
      if (userData.password) {
        userData.password = await this.hashing.createHash(userData.password);
      }
      // Remove role for security - prevent role escalation
      delete userData.role;

      const user = new User(userData);
      Logger.debug("User model created, saving to database");

      await this.usersDao.create(user.toPOJO());

      // Send notification emails and SMS
      try {
        await this.emailService.send(
          user.email,
          "Welcome to Our Platform",
          "Thank you for registering with our service!"
        );
        Logger.info("Welcome email sent successfully to:", user.email);

        await this.smsService.send({
          to: ADMIN_SMS_NUMBER,
          body: `New user registered: ${user.first_name} (${user.email})`,
        });
        Logger.info("Admin notification sent via SMS");
      } catch (notificationError) {
        // Don't fail the registration if notifications fail
        Logger.error(
          "Failed to send registration notifications:",
          notificationError
        );
      }

      return user;
    } catch (error) {
      Logger.error("Error creating user:", error);
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
        Logger.warning("User not found with email:", email);
        const error = new Error("User not found");
        error.type = "NOT_FOUND";
        throw error;
      }
      return user;
    } catch (error) {
      Logger.error("Error retrieving user by email:", error);
      if (!error.type) {
        error.type = "INTERNAL_ERROR";
      }
      throw error;
    }
  }

  // Get user by id
  async getUserById(_id) {
    try {
      const user = await this.usersDao.readOne({ _id });
      Logger.debug("User retrieval by ID:", _id);

      if (!user) {
        Logger.warning("User not found with ID:", _id);
        const error = new Error("User not found");
        error.type = "NOT_FOUND";
        throw error;
      }
      return user;
    } catch (error) {
      Logger.error("Error retrieving user by ID:", error);
      if (!error.type) {
        error.type = "INTERNAL_ERROR";
      }
      throw error;
    }
  }

  async getAllUsers() {
    try {
      const users = await this.usersDao.readMany({});
      Logger.info(`Retrieved ${users.length} users`);
      return users;
    } catch (error) {
      Logger.error("Error retrieving all users:", error);
      throw error;
    }
  }

  // Update user by ID
  async updateUser(_id, updateFields) {
    Logger.debug("Updating user with ID:", _id);
    try {
      const userToUpdate = await this.usersDao.readOne({ _id });

      if (!userToUpdate) {
        Logger.warning("User not found for update with ID:", _id);
        const error = new Error("User not found");
        error.type = "NOT_FOUND";
        throw error;
      }

      const updatedUser = await this.usersDao.updateOne(
        { _id },
        { $set: updateFields },
        { new: true }
      );

      Logger.info("User information updated successfully for ID:", _id);
      return updatedUser;
    } catch (error) {
      Logger.error("Error updating user:", error);
      if (!error.type) {
        error.type = "INTERNAL_ERROR";
      }
      throw error;
    }
  }

  async updatePassword(userId, newPassword, token) {
    try {
      // Determine the correct user ID
      let effectiveUserId = userId;
      if (token && !userId) {
        const decryptedData = await decrypt(token);
        effectiveUserId = decryptedData._id;
      }

      // If no userId could be determined, throw an error
      if (!effectiveUserId) {
        const error = new Error("User ID is not available");
        error.type = "INVALID_ARGUMENT";
        throw error;
      }

      // Hash the new password
      const hashedPassword = await createHash(newPassword);

      // Update the user's password
      const updatedUser = await this.usersDao.updateOne(
        { _id: effectiveUserId },
        { $set: { password: hashedPassword } },
        { new: true }
      );

      // Handle case where user is not found
      if (!updatedUser) {
        const error = new Error("User not found");
        error.type = "NOT_FOUND";
        throw error;
      }

      Logger.info(
        "Password updated successfully for user ID:",
        effectiveUserId
      );
      return updatedUser;
    } catch (error) {
      Logger.error("Error updating password:", error);
      if (!error.type) {
        error.type = "INTERNAL_ERROR";
      }
      throw error;
    }
  }

  async resetPassword(user) {
    try {
      const token = await encrypt({ _id: user._id });

      await this.emailService.send(
        user.email,
        "Password Reset Request",
        `Please click the following link to reset your password: http://localhost:8080/confirmresetpass/${token}`
      );

      Logger.info("Password reset email sent to:", user.email);
      return true;
    } catch (error) {
      Logger.error("Error sending password reset email:", error);
      throw error;
    }
  }

  // Delete user by ID
  async deleteUser(_id) {
    try {
      const deletedUser = await this.usersDao.deleteOne({ _id });

      if (deletedUser) {
        Logger.info("User deleted successfully with ID:", _id);
        return deletedUser;
      } else {
        Logger.warning("User not found for deletion with ID:", _id);
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
      Logger.debug("Updated last login timestamp for user:", userId);
      return updatedUser;
    } catch (error) {
      Logger.error("Error updating last login timestamp:", error);
      throw new Error(`Error updating last login: ${error.message}`);
    }
  }

  async clearInactiveUsers() {
    try {
      const inactiveThreshold = new Date(Date.now() - 48 * 60 * 60 * 1000);
      const inactiveUsers = await this.usersDao.readMany({
        last_login: { $lt: inactiveThreshold },
      });

      Logger.info(
        `Found ${inactiveUsers.length} inactive users without login in the last 48 hours`
      );
      const deletedUsers = [];

      for (const user of inactiveUsers) {
        await this.usersDao.deleteOne({ _id: user._id });
        Logger.info("Deleted inactive user:", user.email);

        try {
          await this.emailService.send(
            user.email,
            "Account Deactivated",
            "Your account has been removed due to inactivity that lasted more than 48 hours. Please register again if you wish to use our services."
          );
        } catch (emailError) {
          Logger.error("Failed to send account deletion email:", emailError);
        }

        deletedUsers.push(user);
      }

      return deletedUsers;
    } catch (error) {
      Logger.error("Error clearing inactive users:", error);
      throw new Error(`Error clearing inactive users: ${error.message}`);
    }
  }
}
