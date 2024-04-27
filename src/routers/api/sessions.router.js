//login
import { Router } from "express";
import {
  deleteTokenFromCookie,
  tokenizeUserInCookie,
} from "../../middlewares/tokens.js";
import { sessionsPost } from "../../controllers/sessions.controller.js";

export const sessionsRouter = Router();

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
