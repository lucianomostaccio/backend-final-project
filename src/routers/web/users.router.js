// @ts-nocheck

import { Router } from "express";
// import { rolesOnly } from "../../middlewares/authorization.js";
import { getDaoUsers } from "../../daos/users/users.dao.js";
// import { ADMIN_EMAIL, ADMIN_PASSWORD } from "../../config/config.js";
import Logger from "../../utils/logger.js";
export const webUsersRouter = Router();
// import { JWT_PRIVATE_KEY } from "../../config/config.js";
// import jwt from "jsonwebtoken";
import { authenticateWithJwt } from "../../middlewares/authentication.js";
import { addImagePathToLocals } from "../../middlewares/imagePath.js";

webUsersRouter.get("/register", authenticateWithJwt, (req, res) => {
  if (!req.user) {
    // Only show the registration view if the user is not logged in
    res.render("register.handlebars", {
      pageTitle: "Register",
      style: "register.css",
    });
  } else {
    res.redirect("/products"); // Redirect the user to the products view if already logged in
  }
});

webUsersRouter.get("/edit", authenticateWithJwt, async (req, res) => {
  try {
    const user = req.user;
    Logger.debug("req.user detected for edit profile page:", user);
    res.render("profileEdit.handlebars", {
      pageTitle: "Edit your profile",
      ...user,
      style: "profile.css",
    });
  } catch (error) {
    Logger.error("Error fetching updated user data:", error); // Log any errors
    res.status(500).render("error.handlebars", { pageTitle: "Error" });
  }
});

// webUsersRouter.get("/profile", authenticateWithJwt, async (req, res) => {
//   // webUsersRouter.get("/profile", rolesOnly, async (req, res) => {
//   try {
//     if (!req.user) {
//       Logger.debug("req.user does not exist for profile page, redirect");
//       res.redirect("/login");
//     } else {
//       Logger.debug("req.user exists in webusersrouter", req.user);
//       const user = req.user;
//       Logger.debug("user detected for profile page:", user);

//       const usersDao = getDaoUsers();
//       const email = user.email;
//       Logger.debug("email:", email);
//       const updatedUser = await usersDao.readOne({ email }, { password: 0 });
//       Logger.debug("Updated user object from database:", updatedUser); // Log the updated user object from DB
//       Logger.debug("Updated user object from database:", updatedUser);
//       // Normalize image path and construct full image URL
//       if (updatedUser.profile_picture) {
//         const basePath = process.env.BASE_URL || "http://localhost:8080";
//         const normalizedImagePath = updatedUser.profile_picture.replace(
//           /\\/g,
//           "/"
//         );
//         const imageUrlPath = normalizedImagePath.replace("src/static/", "");
//         updatedUser.fullImageUrl = `${basePath}/${imageUrlPath}`;
//         Logger.debug("Full image URL:", updatedUser.fullImageUrl);
//         Logger.debug("Full image URL:", updatedUser.fullImageUrl);
//       }
//       Logger.debug("Updated user:", updatedUser);
//       Logger.debug("Session updated with new user data", updatedUser); // Log session update
//       console.log("Session updated with new user data", updatedUser);
//       res.render("profile.handlebars", {
//         pageTitle: "Profile",
//         ...updatedUser,
//         style: "profile.css",
//       });
//     }
//   } catch (error) {
//     Logger.error("Error fetching updated user data:", error); // Log any errors
//     res.status(500).render("error.handlebars", { pageTitle: "Error" });
//   }
// });

webUsersRouter.get("/resetpass", authenticateWithJwt, (req, res) => {
  if (!req.user) {
    res.render("resetPass.handlebars", {
      pageTitle: "Reset Password",
      style: "resetpass.css",
    }); // Only show the reset password view if the user is not logged in
  } else {
    res.redirect("/products"); // Redirect the user to the products view if already logged in
  }
});

webUsersRouter.get("/confirmResetPass/:token", authenticateWithJwt, (req, res) => {
  if (!req.user) {
    res.render("confirmPassReset.handlebars", {
      pageTitle: "Reset Password",
      style: "resetpass.css",
    }); // Only show the reset password view if the user is not logged in
  } else {
    res.redirect("/products"); // Redirect the user to the products view if already logged in
  }
});
