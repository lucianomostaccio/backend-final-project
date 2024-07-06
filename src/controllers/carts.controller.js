import { cartsService } from "../services/carts.service.js";
import Logger from "../utils/logger.js";

export async function getController(req, res, next) {
  Logger.debug("req.user obtained in getController:", req.user);
  Logger.debug("req.user._id obtained in getController", req.user._id);
  try {
    // Ensure req.user exists
    if (!req.user) {
      const typedError = new Error("Auth error");
      typedError["type"] = "FAILED_AUTHENTICATION";
      throw typedError;
    }

    const userId = req.user._id;
    const cart = await cartsService.readOne(userId);
    // console.log("cart", cart)
    res.jsonOk(cart);
  } catch (error) {
    next(error);
  }
}

export async function postController(req, res, next) {
  try {
    const cart = await cartsService.addCart(req.body);
    res.created(cart);
  } catch (error) {
    next(error);
  }
}

export async function putController(req, res, next) {
  try {
    const { action, productId } = req.body;
    const userId = req.user._id;
    console.log("Action:", action, "ProductId:", productId, "UserId:", userId);

    let updatedCart;

    switch (action) {
      case "removeProduct":
        if (productId) {
          console.log("Removing product from cart");
          updatedCart = await cartsService.deleteProductFromCart(userId, productId);
        }
        break;
      case "removeWholeProduct":
        if (productId) {
          console.log("Removing whole product from cart");
          updatedCart = await cartsService.removeWholeProductFromCart(userId, productId);
        }
        break;
      case "addProduct":
        if (productId) {
          console.log("Adding product to cart");
          updatedCart = await cartsService.addProductToCart(userId, productId);
        }
        break;
      default:
        console.log("Updating cart");
        updatedCart = await cartsService.updateCart(userId, req.body);
        break;
    }

    if (!updatedCart) {
      return res.status(404).json({
        status: "error",
        message: "Cart not found or operation failed",
      });
    }

    res.jsonOk(updatedCart);
  } catch (error) {
    console.error("Error in putController:", error);
    next(error);
  }
}

export async function deleteController(req, res, next) {
  try {
    const { cartId } = req.params;
    await cartsService.deleteCart(cartId);
    res.ok();
  } catch (error) {
    next(error);
  }
}
