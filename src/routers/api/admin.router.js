import { Router } from "express";
import {
  getAllController,
  putController,
  deleteController,
} from "../../controllers/users.controller.js";

export const adminRouter = Router();

adminRouter.get("/", getAllController);
adminRouter.put("/:id", putController);
adminRouter.delete("/:id", deleteController);
