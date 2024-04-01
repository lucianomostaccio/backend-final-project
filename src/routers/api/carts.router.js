import { Router } from "express";
import {
  postController,
  getController,
  putController,
  deleteController,
} from "../../controllers/carts.controller.js";

// import { createOrder } from "../../controllers/orders.controller.js";

export const cartsRouter = Router();

cartsRouter.get("/", getController);
cartsRouter.post("/", postController);
cartsRouter.get("/:cartId", getController);
cartsRouter.put("/:cartId/products/:productId", putController);
cartsRouter.delete("/:cartId", deleteController);

// cartsRouter.post("/:cid/purchase", createOrder);
