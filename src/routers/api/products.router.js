import { Router } from "express";
import generateMockProducts from "../../utils/mockProducts.js";
import {
  getController,
  postController,
  deleteController,
  putController,
  // getFilteredAndSortedProductsController,
  // getCategoriesController,
} from "../../controllers/products.controller.js";

export const productsRouter = Router();

productsRouter.get("/", getController);
productsRouter.get("/:pid", getController);
// productsRouter.get("/filtered", getFilteredAndSortedProductsController);
// productsRouter.get("/categories", getCategoriesController);
productsRouter.post("/", postController);
productsRouter.put("/:pid", putController);
productsRouter.delete("/:pid", deleteController);

productsRouter.get("/mockingproducts", (req, res) => {
  const mockProducts = generateMockProducts();
  res.json(mockProducts);
});
