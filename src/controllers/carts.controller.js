import { cartsService } from "../services/carts.service.js";
import Logger from "../utils/logger.js";

export async function getController(req, res, next) {
  try {
    // Ensure req.user exists
    if (!req.user) {
      const typedError = new Error("Authentication required");
      // Using bracket notation to avoid TypeScript errors
      typedError["type"] = "FAILED_AUTHENTICATION";
      throw typedError;
    }

    const userId = req.user._id;
    const cart = await cartsService.readOne(userId);
    res.jsonOk(cart);
  } catch (error) {
    Logger.error("Error retrieving cart:", error);
    next(error);
  }
}

export async function postController(req, res, next) {
  try {
    const cart = await cartsService.addCart(req.body);
    res.created(cart);
  } catch (error) {
    Logger.error("Error creating cart:", error);
    next(error);
  }
}

export async function putController(req, res, next) {
  try {
    const { action, productId, quantity } = req.body;

    if (!req.user) {
      const error = new Error("Authentication required");
      error["type"] = "FAILED_AUTHENTICATION";
      return next(error);
    }

    const userId = req.user._id;
    let updatedCart;

    switch (action) {
      case "removeProduct":
        if (productId) {
          Logger.debug("Removing product from cart");
          updatedCart = await cartsService.deleteProductFromCart(
            userId,
            productId
          );
        } else {
          throw new Error("Product ID is required");
        }
        break;
      case "removeWholeProduct":
        if (productId) {
          Logger.debug("Removing whole product from cart");
          updatedCart = await cartsService.removeWholeProductFromCart(
            userId,
            productId
          );
        } else {
          throw new Error("Product ID is required");
        }
        break;
      case "addProduct":
        if (productId) {
          Logger.debug("Adding product to cart");
          const productQuantity = quantity ? parseInt(quantity) : 1;
          if (productQuantity > 1) {
            updatedCart = await cartsService.readOne(userId);
            if (!updatedCart) {
              updatedCart = await cartsService.addCart({
                userId,
                products: [],
              });
            }

            const existingProductIndex = updatedCart.products.findIndex(
              (p) =>
                p.productId &&
                (p.productId._id === productId || p.productId === productId)
            );

            if (existingProductIndex !== -1) {
              updatedCart.products[existingProductIndex].quantity +=
                productQuantity;
            } else {
              updatedCart.products.push({
                productId,
                quantity: productQuantity,
              });
            }

            updatedCart = await cartsService.updateCart(userId, {
              products: updatedCart.products,
            });
          } else {
            updatedCart = await cartsService.addProductToCart(
              userId,
              productId
            );
          }
        } else {
          throw new Error("Product ID is required");
        }
        break;
      case "clearCart":
        Logger.debug("Clearing cart");
        const currentCart = await cartsService.readOne(userId);
        if (currentCart) {
          updatedCart = await cartsService.updateCart(userId, { products: [] });
        } else {
          throw new Error("Cart not found");
        }
        break;
      default:
        Logger.debug("Updating cart");
        const updateData = { ...req.body };
        delete updateData.action;
        updatedCart = await cartsService.updateCart(userId, updateData);
        break;
    }

    try {
      const populatedCart = await cartsService.readOne(userId);

      let total = 0;

      Logger.debug(
        "Populated cart for total calculation:",
        JSON.stringify(populatedCart, null, 2)
      );

      if (
        populatedCart &&
        populatedCart.products &&
        populatedCart.products.length > 0
      ) {
        total = populatedCart.products.reduce((sum, item) => {
          if (
            item.productId &&
            typeof item.productId === "object" &&
            item.productId.price
          ) {
            return sum + item.productId.price * item.quantity;
          }
          return sum;
        }, 0);
      }

      Logger.debug(`Calculated total: ${total}`);

      const responsePayload = {
        ...updatedCart,
        total,
      };

      res.status(200).json({
        status: "success",
        payload: responsePayload,
      });
    } catch (error) {
      Logger.error("Error calculating total:", error);
      res.jsonOk(updatedCart);
    }
  } catch (error) {
    Logger.error("Error in cart operation:", error);
    next(error);
  }
}

export async function deleteController(req, res, next) {
  try {
    const { cartId } = req.params;
    await cartsService.deleteCart(cartId);
    res.ok();
  } catch (error) {
    Logger.error("Error deleting cart:", error);
    next(error);
  }
}
