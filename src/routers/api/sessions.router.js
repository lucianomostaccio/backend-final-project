//login
import { Router } from "express";
import {
  deleteTokenFromCookie,
  tokenizeUserInCookie,
} from "../../middlewares/tokens.js";
import { githubSessionsPost, sessionsPost } from "../../controllers/sessions.controller.js";
import Logger from "../../utils/logger.js";
import passport from "passport";
import { authenticateWithJwt } from "../../middlewares/authentication.js";

export const sessionsRouter = Router();

sessionsRouter.post(
  "/",
  sessionsPost,
  tokenizeUserInCookie,
  async (req, res) => {
    try {
      // @ts-ignore
      console.log("session created", req.user);
      res["created"](req.user);
      Logger.info("Session created for", req.user);
    } catch (error) {
      // Handle any errors that may occur during the process
      console.error("Error creating session:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

sessionsRouter.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

sessionsRouter.get(
  "/auth/github/callback",
  githubSessionsPost,
  tokenizeUserInCookie,
  (req, res) => {
    res.redirect("/"); // Redirect to home page after successful login
  }
);

sessionsRouter.delete("/current", authenticateWithJwt, deleteTokenFromCookie, (req, res) => {
  res["ok"]();
});
