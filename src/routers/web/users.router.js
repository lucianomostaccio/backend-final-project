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

webUsersRouter.get("/register", authenticateWithJwt, (req, res) => {
  console.log("req user obtained in register page", req.user);
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

webUsersRouter.get("/profile", authenticateWithJwt, async (req, res) => {
  // webUsersRouter.get("/profile", rolesOnly, async (req, res) => {
  try {
    if (!req.user) {
      console.log("req.user does not exist for profile page, redirect");
      res.redirect("/login");
    } else {
      console.log("req.user exists in webusersrouter", req.user);
      const user = req.user;
      console.log("user detected for profile page:", user);

      const usersDao = getDaoUsers();
      const email = user.email;
      const updatedUser = await usersDao.readOne({ email }, { password: 0 });
      Logger.debug("Updated user object from database:", updatedUser); // Log the updated user object from DB

      const normalizedImagePath = updatedUser.profile_picture.replace(
        /\\/g,
        "/"
      );
      Logger.debug("Normalized image path:", normalizedImagePath); // Log the normalized image path

      updatedUser.fullImageUrl = `http://localhost:8080/${normalizedImagePath.replace(
        "src/static/",
        ""
      )}`;
      Logger.debug("Full image URL:", updatedUser.fullImageUrl); // Log the full image URL

      console.log("Updated user:", updatedUser);
      Logger.debug("Session updated with new user data", updatedUser); // Log session update

      res.render("profile.handlebars", {
        pageTitle: "Profile",
        ...updatedUser,
        style: "profile.css",
      });
    }
  } catch (error) {
    Logger.error("Error fetching updated user data:", error); // Log any errors
    res.status(500).render("error.handlebars", { pageTitle: "Error" });
  }
});

webUsersRouter.get("/edit", authenticateWithJwt, (req, res) => {
  // webUsersRouter.get("/edit", rolesOnly, (req, res) => {
  res.render("profileEdit.handlebars", {
    pageTitle: "Edit your profile",
    ...req.user,
    style: "profile.css",
  });
});

webUsersRouter.get("/resetpass", authenticateWithJwt, (req, res) => {
  if (!req.user) {
    res.render("resetpass.handlebars", {
      pageTitle: "Reset Password",
      style: "resetpass.css",
    }); // Only show the reset password view if the user is not logged in
  } else {
    res.redirect("/products"); // Redirect the user to the products view if already logged in
  }
});
