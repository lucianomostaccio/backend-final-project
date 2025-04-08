// tickets.router.js
import { Router } from "express";
import {
  postController,
  getController,
} from "../../controllers/tickets.controller.js";
import { authenticateWithJwt } from "../../middlewares/authentication.js";

export const ticketsRouter = Router();

ticketsRouter.post("/", authenticateWithJwt, postController);
ticketsRouter.get("/", authenticateWithJwt, getController);
ticketsRouter.get("/:ticketId", authenticateWithJwt, getController);
