import { Router } from "express";
import generateMockProducts from "../../utils/mockProducts.js";
import {
  getController,
  postController,
  deleteController,
  putController,
  addToCartController,
} from "../../controllers/products.controller.js";
import { authenticateWithJwt } from "../../middlewares/authentication.js";

export const productsRouter = Router();

productsRouter.get("/", getController); //ok
productsRouter.get("/:pcode", getController); //ok
productsRouter.post("/", postController); //ok
productsRouter.put("/:pcode", putController);
productsRouter.delete("/:pcode", deleteController); //ok
productsRouter.post(
  "/:pcode/add-to-cart",
  authenticateWithJwt, //needed to get user data using req.user
  addToCartController
);

productsRouter.get("/mockingproducts", (req, res) => {
  const mockProducts = generateMockProducts();
  res.json(mockProducts);
});
