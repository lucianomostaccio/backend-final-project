import { Router } from "express";
import {
  postController,
} from "../../controllers/contact.controller.js";

export const contactRouter = Router();

contactRouter.post("/", postController);
