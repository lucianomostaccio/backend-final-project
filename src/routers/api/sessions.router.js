//login
import { Router } from "express";
// import { ADMIN_EMAIL, ADMIN_PASSWORD } from "../../config/config.js";
import {
  deleteTokenFromCookie,
  tokenizeUserInCookie,
} from "../../middlewares/tokens.js";
import { sessionsPost } from "../../controllers/sessions.controller.js";
// import { authenticateWithJwt } from "../../middlewares/authentication.js";

export const sessionsRouter = Router();

// sessionsRouter.get(
//   "/github",
//   passport.authenticate("github", { scope: ["user:email"] }),
//   async (req, res) => {}
// );

// sessionsRouter.get(
//   "/githubcallback",
//   passport.authenticate("github", {
//     // successRedirect: "/",
//     failureRedirect: "/login",
//   }),
//   async (req, res) => {
//     req.session["user"] = req.user;
//     res.redirect("/");
//   }
// );

sessionsRouter.post("/", sessionsPost, tokenizeUserInCookie, (req, res) => {
  res["created"](req.user);
  console.log("session created for", req.user)
});

sessionsRouter.delete("/current", deleteTokenFromCookie, (req, res) => {
  console.log("token from cookie deleted in sessions/current")
  res["deleted"]();
});
