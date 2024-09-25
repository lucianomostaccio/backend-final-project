import { usersService } from "../services/index.js";
import { createHash } from "../utils/hashing.js";
import Logger from "../utils/logger.js";

// all controllers use Service's functions. In this case, usersService

export async function getController(req, res, next) {
  try {
    const user = await usersService.getUserByEmail(req.user.email);
    Logger.debug("user found by user get controller:", user);
    res.jsonOk(user);
  } catch (error) {
    Logger.error("Error in getController:", error);
    next(error);
  }
}

export async function getAllController(req, res, next) {
  try {
    const users = await usersService.getAllUsers();
    const filteredUsers = users.map((user) => ({
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
    }));
    Logger.debug("users found by user get controller:", filteredUsers);

    res.jsonOk(filteredUsers);
  } catch (error) {
    Logger.error("Error in getController:", error);
    next(error);
  }
}

// register
export async function postController(req, res, next) {
  try {
    Logger.debug("req.body obtained in post controller", req.body);
    const user = await usersService.addUser(req.body);
    Logger.debug("User created/posted by postController:", user);
    req.user = user;
    res.created(user);
  } catch (error) {
    Logger.error("Error in postController:", error);
    next(error);
  }
}

//update profile:
/**
 * This function handles the PUT request to update the user's profile.
 * It first extracts the user ID from the request object, then extracts the
 * fields to be updated from the request body. It also checks if a profile 
 * picture is included in the request, and if so, it extracts its path.
 * 
 * If a current password and new password are included in the request, it 
 * authenticates the user with the current password and hashes the new password.
 * 
 * Finally, it updates the user's profile with the extracted fields and sends a
 * response containing the updated user object.
 * 
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
export async function putController(req, res, next) {
  try {
    // Extract user ID from request object
    const userId = req.user._id;

    // Extract fields from request body
    const { first_name, last_name, age, currentPassword, newPassword, repeatNewPassword } = req.body;

    // Create an object to hold the fields to be updated
    const updateFields = {
      first_name,
      last_name,
      age,
    };

    // If a profile picture is included in the request, extract its path
    if (req.file) {
      updateFields.profile_picture = req.file.path;
    }

    // Check if newPassword matches repeatNewPassword
    if (newPassword && repeatNewPassword && newPassword !== repeatNewPassword) {
      return res.status(400).json({
        message: "The new passwords do not match.",
      });
    }

    // If a current password and new password are included in the request,
    // authenticate the user with the current password and hash the new password
    if (currentPassword && newPassword) {
      await usersService.authenticate({
        email: req.user.email,
        password: currentPassword,
      });

      const hashedNewPassword = await createHash(newPassword);
      updateFields.password = hashedNewPassword;
    }

    // Update the user's profile with the extracted fields
    const updatedUser = await usersService.updateUser(userId, updateFields);

    // Update the request object with the updated user object
    req.user = updatedUser;

    // Send a response containing the updated user object
    res.jsonOk(updatedUser);
  } catch (error) {
    // If an error occurs, pass it to the next middleware function
    next(error);
  }
}

export async function deleteController(req, res, next) {
  try {
    const deletedUser = await usersService.deleteUser(req.params.id);
    Logger.debug("user detected to be deleted:", deletedUser);
    res.ok();
  } catch (error) {
    next(error);
  }
}

export const inactiveController = async (req, res, next) => {
  try {
    const deletedUsers = await usersService.clearInactiveUsers();
    Logger.debug("deleted users:", deletedUsers);
    res.ok();
  } catch (error) {
    next(error);
  }
};

export const resetPasswordController = async (req, res, next) => {
  try {
    const { email } = req.body;
    console.log(email)
    const user = await usersService.getUserByEmail(email);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    Logger.debug("user found by email");
    await usersService.resetPassword(user);
    res.ok();
  } catch (error) {
    Logger.error("Error in retrievePasswordController:", error);
    next(error);
  }
};

export const confirmPasswordResetController = async (req, res, next) => {
  try {
    const { token }= req.params;
    const { newPassword } = req.body;
    const user = await usersService.updatePassword(null, newPassword, token);
    if (!user) {
      return res.status(400).json({ message: "Password reset token is invalid or has expired." });
    }
    console.log("password reset confirmed");
    res.ok();
  } catch (error) {
    next(error);
  }
}
