import { Router } from "express";
import { authenticateWithJwt } from "../../middlewares/authentication.js";
import Logger from "../../utils/logger.js";

export const sessionsRouter = Router();

//if user is not logged in render login. Else redirect to products, when trying to get into /login.

sessionsRouter.get("/login", authenticateWithJwt, (req, res) => {
  if (!req.user) {
    Logger.warning("req.user does not exist in sessions router, redirect");
    res.render("login.handlebars", { pageTitle: "Login" });
  } else {
    Logger.warning("req.user exists in sessions router", req.user);
    res.redirect("/products");
  }
});
