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

//update
export async function putController(req, res, next) {
  try {
    console.log("req.body in putController", req.body);
    // Logger.debug("req.params.id detected in put", req.params.id);
    const userId = req.params.id || req.user._id;
    // Logger.debug("userId obtained in putController:", userId);
    let updateFields = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      age: req.body.age,
    };

    // @ts-ignore
    if (req.body.role !== usersService.getUserById(userId).role) {
      console.log("role to be updated", req.body.role);
      updateFields.role = req.body.role;
    }
    else{
      console.log("role not updated", req.body.role);
    }

    if (req.body.currentPassword && req.body.newPassword) {
      try {
        console.log(
          "user password detected in update form",
          req.user.email,
          req.body.currentPassword,
          req.body.newPassword
        );
        await usersService.authenticate({
          email: req.user.email,
          password: req.body.currentPassword,
        });
        //hash new password
        const hashedNewPassword = await createHash(req.body.newPassword);
        //asign new password
        updateFields.password = hashedNewPassword;
        console.log("password added into updateFields:", updateFields);
      } catch (error) {
        throw error;
      }
    }

    Logger.debug("updateFields obtained in putController:", updateFields);

    if (req.file) {
      console.log("profile picture detected in update form", req.file);
      updateFields.profile_picture = req.file.path;
    }

    const updatedUser = await usersService.updateUser(userId, updateFields);
    console.log("updated user after usersService:", updatedUser);
    Logger.debug(
      "user fields updated in put controller after using usersService.update:",
      updatedUser
    );

    req.user = updatedUser;

    res.jsonOk(updatedUser);
  } catch (error) {
    Logger.error("Error updating user information:", error);
    const typedError = new Error("Invalid Argument");
    typedError["type"] = "INVALID_ARGUMENT";
    throw typedError;
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

export const retrievePasswordController = async (req, res, next) => {
  try {
    console.log("req.body", req.body);
    const { email } = req.body.email;
    const user = await usersService.getUserByEmail(email);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    Logger.debug("user found by email:", user);
    await usersService.retrievePassword(user.email, user.password);
    res.ok();
  } catch (error) {
    Logger.error("Error in retrievePasswordController:", error);
    next(error);
  }
};
