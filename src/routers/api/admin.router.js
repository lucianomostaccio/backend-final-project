import { Router } from "express";
import {
  getAllController,
  putController,
  deleteController,
} from "../../controllers/users.controller.js";
import { rolesOnly } from "../../middlewares/authorization.js";
import { authenticateWithJwt } from "../../middlewares/authentication.js";

export const adminRouter = Router();

adminRouter.get("/", authenticateWithJwt, rolesOnly("admin"), getAllController);
adminRouter.put("/:id", authenticateWithJwt, rolesOnly("admin"), putController);
adminRouter.delete(
  "/:id",
  authenticateWithJwt,
  rolesOnly("admin"),
  deleteController
);
