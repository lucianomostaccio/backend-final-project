import { usersService } from "../services/index.js";
import Logger from "../utils/logger.js";

// all controllers use Service's functions. In this case, usersService

export async function getController(req, res, next) {
  try {
    const user = await usersService.getUserByEmail(req.user.email);
    console.log("user found by user get controller:", user);
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
    console.log("users found by user get controller:", filteredUsers);

    res.jsonOk(filteredUsers);
  } catch (error) {
    Logger.error("Error in getController:", error);
    next(error);
  }
}

// register
export async function postController(req, res, next) {
  try {
    Logger.debug("Entered postController");
    console.log("req.body obtained in post controller", req.body);
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
    const userId = req.user._id;
    console.log("userId obtained in putController:", userId);
    let updateFields = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      age: req.body.age
    };

    if (req.body.role) {
      updateFields.role = req.body.role;
    }

    console.log("updateFields obtained in putController:", updateFields);

    if (req.file) {
      updateFields.profile_picture = req.file.path;
    }

    const updatedUser = await usersService.updateUser(userId, updateFields);
    console.log(
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
    console.log("user detected to be deleted:", deletedUser);
    res.ok();
  } catch (error) {
    next(error);
  }
}

export const inactiveController = async (req, res, next) => {
  try {
    const deletedUsers = await usersService.clearInactiveUsers();
    console.log("deleted users:", deletedUsers);
    res.ok();
  } catch (error) {
    next(error);
  }
};

