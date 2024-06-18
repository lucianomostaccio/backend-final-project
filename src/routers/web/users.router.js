// @ts-nocheck

import { Router } from "express";
// import { rolesOnly } from "../../middlewares/authorization.js";
// import { ADMIN_EMAIL, ADMIN_PASSWORD } from "../../config/config.js";
import Logger from "../../utils/logger.js";
export const webUsersRouter = Router();
import { authenticateWithJwt } from "../../middlewares/authentication.js";

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
    if (!req.user) {
      res.redirect("/login"); // Redirect the user to the login view if not logged in
      return;
    }
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
