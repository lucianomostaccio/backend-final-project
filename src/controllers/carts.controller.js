import { cartsService } from "../services/carts.service.js";

export async function getController(req, res, next) {
  console.log("req.user obtained in getController:", req.user);
  console.log("req.user._id obtained in getController", req.user._id);
  try {
    // Ensure req.user exists
    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const userId = req.user._id; //
    const cart = await cartsService.readOne(userId);
    res.result(cart);
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
      return res.result(updatedCart);
    }

    const updatedCart = await cartsService.updateCart(cartId, payload);
    res.result(updatedCart);
  } catch (error) {
    next(error);
  }
}

export async function deleteController(req, res, next) {
  try {
    const { cartId } = req.params;
    await cartsService.deleteCart(cartId);
    res.json({ message: "Cart cleared successfully" });
  } catch (error) {
    next(error);
  }
}

// export async function deleteProductFromCartController(req, res, next) {
//   try {
//     const { cartId, productId } = req.params;
//     const updatedCart = await cartsService.deleteProductFromCart(
//       cartId,
//       productId
//     );
//     res.result(updatedCart);
//   } catch (error) {
//     next(error);
//   }
// }
