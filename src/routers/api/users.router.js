//register
// Import necessary modules
import { Router } from "express";
import {
  postController,
  deleteController,
  putController,
  getAllController,
  inactiveController,
} from "../../controllers/users.controller.js";
import { createHash } from "../../utils/hashing.js";
import { extractFile } from "../../middlewares/multer.js";
import Logger from "../../utils/logger.js";
import { authenticateWithJwt } from "../../middlewares/authentication.js";

// Create the router
export const usersRouter = Router();

// Handle user registration (POST /api/users/)
usersRouter.post(
  "/",
  extractFile("profile_picture"),
  postController,
  async (req, res) => {
    //put exact name assigned in form to picture field
    try {
      // Set the profile picture path based on the uploaded file
      if (req.file) {
        req.body.profile_picture = req.file.path;
        console.log("profile pic detected");
      }

      console.log("user created");
      (req, res) => {
        res["result"](req["user"]);
      };
    } catch (error) {
      // Handle errors
      Logger.error("Error in user registration:", error);
      const typedError = new Error("Invalid Argument");
      typedError["type"] = "INVALID_ARGUMENT";
      throw typedError;
    }
  }
);

usersRouter.get("/current", authenticateWithJwt, async (req, res, next) => {
  res["jsonOk"](req["user"]);
});

usersRouter.get("/", getAllController);

// Update user password (PUT /api/users/resetpass)
usersRouter.put("/resetpass", authenticateWithJwt, async function (req, res) {
  try {
    // Hash the new password
    req.body.password = createHash(req.body.password);

    // Adapt putController to handle password change specifically
    const updatedUser = await putController(req, res);
    Logger.info("User password updated");

    // Successful response
    res["jsonOk"](updatedUser);
  } catch (error) {
    // Handle errors
    Logger.error("Error updating user password:", error);
    const typedError = new Error("Invalid Argument");
    typedError["type"] = "INVALID_ARGUMENT";
    throw typedError;
  }
});

// Update user profile information (PUT /api/users/edit)
usersRouter.put(
  "/edit",
  authenticateWithJwt,
  extractFile("profile_picture"),
  putController
);

// Route to delete a specific user by ID
usersRouter.delete("/:id", deleteController);

// Route to clear inactive users
usersRouter.delete("/", inactiveController);

// // Delete inactive users
// usersRouter.delete("/", clearInactiveUsersController);
