//register
// Import necessary modules
import { Router } from "express";
import {
  getController,
  postController,
  deleteController,
  putController,
  getAllController,
} from "../../controllers/users.controller.js";
import { createHash } from "../../utils/hashing.js";
// import { onlyLoggedInRest } from "../../middlewares/authorization.js";
import { extractFile } from "../../middlewares/multer.js";
import Logger from "../../utils/logger.js";
import { tokenizeUserInCookie } from "../../middlewares/tokens.js";
import { rolesOnly } from "../../middlewares/authorization.js";
import { authenticateWithJwt } from "../../middlewares/authentication.js";

// Create the router
export const usersRouter = Router();

// Handle user registration (POST /api/users/)
usersRouter.post(
  "/",
  extractFile("profile_picture"),
  postController,
  tokenizeUserInCookie,
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
        res["result"](req.user);
      };
    } catch (error) {
      // Handle errors
      Logger.error("Error in user registration:", error);
      res.status(400).json({ status: "error", message: error.message });
    }
  }
);

usersRouter.get("/current", authenticateWithJwt, async (req, res, next) => {
  res["result"](req.user);
});

usersRouter.get(
  "/",
  authenticateWithJwt,
  rolesOnly(["admin"]),
  getAllController
);

// Update user password (PUT /api/users/resetpass)
usersRouter.put("/resetpass", authenticateWithJwt, async function (req, res) {
  try {
    // Hash the new password
    req.body.password = createHash(req.body.password);

    // Adapt putController to handle password change specifically
    const updatedUser = await putController(req, res);
    Logger.info("User password updated");

    // Successful response
    res["updated"](updatedUser);
  } catch (error) {
    // Handle errors
    Logger.error("Error updating user password:", error);
    res.status(400).json({ status: "error", message: error.message });
  }
});

// Update user profile information (PUT /api/users/edit)
usersRouter.put("/edit", extractFile("profile_picture"), putController);

usersRouter.delete("/:id", deleteController);
