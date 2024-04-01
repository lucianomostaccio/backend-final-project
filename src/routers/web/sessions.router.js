import { Router } from "express";
import { authenticateWithJwt } from "../../middlewares/authentication.js";
// import { authenticateWithJwt } from "../../middlewares/authentication.js";

export const sessionsRouter = Router();

//if user is not logged in render login. Else redirect to products, when trying to get into /login.
//NOTE: when token is destroyed, having authenticateWithJwt here will break the app with "unauthorized" error
sessionsRouter.get("/login", authenticateWithJwt, (req, res) => {
  if (!req.user) {
    console.log("req.user does not exist, redirect");
    res.render("login.handlebars", { pageTitle: "Login", style: "login.css" });
  } else {
    console.log("req.user exists in sessions router", req.user);
    res.redirect("/products");
  }
});
