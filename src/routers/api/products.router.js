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
productsRouter.get("/:pid", getController); //pcode or pid?
productsRouter.post("/", postController); //ok
productsRouter.put("/:pid", putController); //pcode or pid?
productsRouter.delete("/:pid", deleteController); //pcode or pid?
productsRouter.post(
  "/:pid/add-to-cart", //pcode or pid?
  authenticateWithJwt, //needed to get user data using req.user
  addToCartController
);

productsRouter.get("/mockingproducts", (req, res) => {
  const mockProducts = generateMockProducts();
  res.json(mockProducts);
});
