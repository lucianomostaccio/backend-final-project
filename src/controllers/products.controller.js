import { productsService } from "../services/products.service.js";
import Logger from "../utils/logger.js";

export async function getController(req, res, next) {
  try {
    Logger.debug(
      "Accessed get products controller, req.params.pid is:",
      req.params.pid
    );

    if (req.params.pid) {
      // If a pid is provided in the parameters, search for a specific product
      const product = await productsService.readOne({ _id: req.params.pid });
      if (!product) {
        return res.status(404).json({ error: "Product not found" });
      }
      return res.jsonOk(product);
    } else {
      // If no pid is provided, get all products
      let query = {};

      // Check if a category is provided in the query parameters
      if (req.query.category) {
        query.category = req.query.category;
      }

      const products = await productsService.readMany(query);
      return res.jsonOk(products);
    }
  } catch (error) {
    next(error);
  }
}

export async function postController(req, res, next) {
  try {
    Logger.debug("req.body to create product:", req.body);
    const product = await productsService.addProduct(req.body);
    res.created(product);
    Logger.debug("product created:", product);
  } catch (error) {
    next(error);
  }
}

export async function putController(req, res, next) {
  try {
    const productId = req.params.pid;
    const updatedProduct = await productsService.updateProduct(
      productId,
      req.body
    );
    res.jsonOk(updatedProduct);
  } catch (error) {
    next(error);
  }
}

export async function deleteController(req, res, next) {
  try {
    const product = await productsService.deleteProduct({
      _id: req.params.pid,
    });
    Logger.debug("product to delete:", product);
    res.ok(product);
  } catch (error) {
    next(error);
  }
}
