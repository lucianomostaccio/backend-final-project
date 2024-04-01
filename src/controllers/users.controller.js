import { usersService } from "../services/index.js";
import Logger from "../utils/logger.js";

// all controllers use Service's functions. In this case, usersService

export async function getController(req, res, next) {
  try {
    const user = await usersService.getUserByEmail(req.user.email);
    console.log("user found by user get controller:", user);
    res.result(user);
  } catch (error) {
    Logger.error("Error in getController:", error);
    next(error);
  }
}

export async function getAllController(req, res, next) {
  try {
    const users = await usersService.getAllUsers();
    console.log("user found by user get controller:", users);
    res.result(users);
  } catch (error) {
    Logger.error("Error in getController:", error);
    next(error);
  }
}

// register
export async function postController(req, res, next) {
  try {
    Logger.debug("Entered postController");
    console.log("req.body obtained in post controller",req.body)
    const user = await usersService.addUser(req.body);
    Logger.debug("User created/posted by postController:", user);
    req.user = user;
    next()
  } catch (error) {
    Logger.error("Error in postController:", error);
    next(error);
  }
}

//update
export async function putController(req, res, next) {
  try {
    const userId = req.params.userId;
    const updateFields = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      age: req.body.age,
    };

    if (req.file) {
      updateFields.profile_picture = req.file.path;
    }

    const updatedUser = await usersService.updateUser(userId, updateFields);
    res.updated(updatedUser);
  } catch (error) {
    Logger.error("Error updating user information:", error);
    res.status(400).json({ status: "error", message: error.message });
  }
}

export async function deleteController(req, res, next) {
  try {
    await usersService.deleteUser(req.params.id);
    res.deleted();
  } catch (error) {
    next(error);
  }
}
