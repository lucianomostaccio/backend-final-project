import { cartsService } from "../services/carts.service.js";
import { usersService } from "../services/index.js";
import { productsService } from "../services/products.service.js";
import Logger from "../utils/logger.js";

export async function getController(req, res, next) {
  try {
    Logger.debug(
      "Accessed get products controller, req.params.pid is:",
      req.params.pid
    );
    if (req.params.pid) {
      // If a pid is provided in the parameters, search for a specific product where _id field is equal to req.params.pid
      const product = await productsService.readOne({ _id: req.params.pid });
      if (!product) {
        // If the product is not found, return a 404 error
        return res.status(404).json({ error: "Product not found" });
      }
      // If the product is found, return it in the response
      return res.jsonOk(product);
    } else {
      // If no pid is provided in the parameters, get all products
      const products = await productsService.readMany({});
      return res.jsonOk(products);
    }
  } catch (error) {
    // Handle errors
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

export async function addToCartController(req, res, next) {
  Logger.debug("req.params:", req.params);
  const { pid } = req.params;
  Logger.debug("product id obtained in controller", pid);
  Logger.debug("user", req.user);

  try {
    const user = await usersService.getUserByEmail(req.user.email);
    Logger.debug("user id:", user._id);
    await cartsService.addProductToCart(user._id, pid);

    res.ok();
  } catch (error) {
    res.status(500).send("Error adding product to cart");
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

// export async function putController(req, res, next) {
//   try {
//     const product = await productsService.updateProduct(req.body)
//     res.delete(product)
//   } catch (error) {
//     next(error)
//   }
// }
