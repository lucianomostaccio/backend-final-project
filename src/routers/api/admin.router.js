//register
// Import necessary modules
import { Router } from "express";
import {
  getAllController,
} from "../../controllers/users.controller.js";

export const adminRouter = Router();

adminRouter.get("/", getAllController);

