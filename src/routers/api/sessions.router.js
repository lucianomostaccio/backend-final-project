//login
import { Router } from "express";
// import { ADMIN_EMAIL, ADMIN_PASSWORD } from "../../config/config.js";
import {
  deleteTokenFromCookie,
  tokenizeUserInCookie,
} from "../../middlewares/tokens.js";
import { sessionsPost } from "../../controllers/sessions.controller.js";
import { usersService } from "../../services/index.js";
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

sessionsRouter.post(
  "/",
  sessionsPost,
  tokenizeUserInCookie,
  async (req, res) => {
    try {
      // @ts-ignore
      res["created"](req.user);
      console.log("Session created for", req.user);
    } catch (error) {
      // Handle any errors that may occur during the process
      console.error("Error creating session:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

sessionsRouter.delete("/current", deleteTokenFromCookie, (req, res) => {
  res["ok"]();
});
