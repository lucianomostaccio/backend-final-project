import { cartsService } from "../services/carts.service.js";
import { usersService } from "../services/index.js";
import { productsService } from "../services/products.service.js";

export async function getController(req, res, next) {
  try {
    console.log("Accessed get products controller");
    if (req.params.pid) {
      // If a pid is provided in the parameters, search for a specific product
      const product = await productsService.readOne({ code: req.params.pid });
      if (!product) {
        // If the product is not found, return a 404 error
        return res.status(404).json({ error: "Product not found" });
      }
      // If the product is found, return it in the response
      return res.result(product);
    } else {
      // If no pid is provided in the parameters, get all products
      const products = await productsService.readMany({});
      return res.result(products);
    }
  } catch (error) {
    // Handle errors
    next(error);
  }
}

export async function postController(req, res, next) {
  try {
    console.log("req.body to create product:", req.body);
    const product = await productsService.addProduct(req.body);
    res.created(product);
    console.log("product created:", product);
  } catch (error) {
    next(error);
  }
}

export async function addToCartController(req, res, next) {
  console.log("req.params:", req.params);
  const { pid } = req.params;
  console.log("product id obtained in controller", pid);
  console.log("user", req.user);

  try {
    const user = await usersService.getUserByEmail(req.user.email);
    console.log("user id:", user._id);
    await cartsService.addProductToCart(user._id, pid);

    res.status(200).json({ message: "Product added to cart successfully" });
  } catch (error) {
    res.status(500).send("Error adding product to cart");
    next(error);
  }
}

export async function putController(req, res, next) {
  try {
    const productCode = req.params.pid;
    const updatedProduct = await productsService.updateProduct(
      productCode,
      req.body
    );
    res.result(updatedProduct);
  } catch (error) {
    next(error);
  }
}

export async function deleteController(req, res, next) {
  try {
    const product = await productsService.deleteProduct({
      code: req.params.pid,
    });
    console.log("product to delete:", product);
    res.deleted(product);
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
