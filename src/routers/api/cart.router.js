import { Router } from "express";
import {
  postController,
  getController,
  putController,
  deleteController,
} from "../../controllers/carts.controller.js";
import { authenticateWithJwt } from "../../middlewares/authentication.js";

// import { createTicket } from "../../controllers/tickets.controller.js";

export const cartsRouter = Router();

cartsRouter.get("/", getController);
cartsRouter.post("/", postController);
cartsRouter.get("/:cartId", getController);
cartsRouter.put("/", authenticateWithJwt, putController);
cartsRouter.delete("/:cartId", deleteController);

// cartsRouter.post("/:cid/purchase", createTicket);
