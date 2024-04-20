import { cartsService } from "../services/carts.service.js";

export async function getController(req, res, next) {
  console.log("req.user obtained in getController:", req.user);
  console.log("req.user._id obtained in getController", req.user._id);
  try {
    // Ensure req.user exists
    if (!req.user) {
      const typedError = new Error("Auth error");
      typedError["type"] = "FAILED_AUTHENTICATION";
      throw typedError;
    }

    const userId = req.user._id;
    const cart = await cartsService.readOne(userId);
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
    const { cartId, productId } = req.params;

    const payload = req.body;

    if (payload.action === "removeProduct" && productId) {
      const updatedCart = await cartsService.deleteProductFromCart(
        cartId,
        productId
      );
      return res.jsonOk(updatedCart);
    }

    const updatedCart = await cartsService.updateCart(cartId, payload);
    res.jsonOk(updatedCart);
  } catch (error) {
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
