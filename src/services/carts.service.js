import { Cart } from "../models/carts.model.js";
import { getDaoCarts } from "../daos/carts/cart.dao.js";
import Logger from "../utils/logger.js";

const cartsDao = getDaoCarts();

class CartsService {
  async addCart(cartData) {
    try {
      const cart = new Cart(cartData);
      const newCart = await cartsDao.create(cart.toPOJO());
      Logger.info("Cart created successfully");
      return newCart;
    } catch (error) {
      Logger.error("Error creating cart:", error);
      throw error;
    }
  }

  async readOne(userId) {
    try {
      return await cartsDao.readOne({ userId });
    } catch (error) {
      Logger.error("Error reading cart:", error);
      throw error;
    }
  }

  async readOneById(id) {
    try {
      return await cartsDao.readOne({ _id: id });
    } catch (error) {
      Logger.error("Error reading cart by ID:", error);
      throw error;
    }
  }

  async addProductToCart(userId, productId) {
    try {
      let cart = await this.readOne(userId);
      if (!cart) {
        cart = await cartsDao.create({ userId, products: [] });
        Logger.info(`New cart created for user: ${userId}`);
      }

      const productIndex = cart.products.findIndex(
        (product) =>
          product.productId &&
          (product.productId._id === productId ||
            product.productId === productId)
      );

      if (productIndex !== -1) {
        cart.products[productIndex].quantity += 1;
      } else {
        cart.products.push({ productId, quantity: 1 });
      }

      const updatedCart = await cartsDao.updateOne(
        { _id: cart._id },
        { $set: { products: cart.products } }
      );

      if (!updatedCart) {
        throw new Error("Failed to update cart");
      }

      // Calculate and include the total
      const total = await this.calculateTotalPrice(cart._id);
      return { ...updatedCart, total };
    } catch (error) {
      Logger.error("Error adding product to cart:", error);
      throw error;
    }
  }

  async updateProductQuantity(userId, productId, change) {
    try {
      const cart = await this.readOne(userId);

      if (!cart) {
        throw new Error("Cart not found");
      }

      const productIndex = cart.products.findIndex(
        (product) =>
          product.productId &&
          (product.productId._id === productId ||
            product.productId === productId)
      );

      if (productIndex === -1) {
        throw new Error("Product not found in cart");
      }

      cart.products[productIndex].quantity += change;

      if (cart.products[productIndex].quantity <= 0) {
        cart.products.splice(productIndex, 1);
      }

      const updatedCart = await cartsDao.updateOne(
        { _id: cart._id },
        { $set: { products: cart.products } }
      );

      if (!updatedCart) {
        throw new Error("Failed to update cart");
      }

      // Calculate and include the total
      const total = await this.calculateTotalPrice(cart._id);
      return { ...updatedCart, total };
    } catch (error) {
      Logger.error("Error updating product quantity:", error);
      throw error;
    }
  }

  async deleteProductFromCart(userId, productId) {
    try {
      const updatedCart = await this.updateProductQuantity(
        userId,
        productId,
        -1
      );
      return updatedCart;
    } catch (error) {
      Logger.error("Error deleting product from cart:", error);
      throw error;
    }
  }

  async removeWholeProductFromCart(userId, productId) {
    try {
      return this.updateProductQuantity(
        userId,
        productId,
        Number.NEGATIVE_INFINITY
      );
    } catch (error) {
      Logger.error("Error removing whole product from cart:", error);
      throw error;
    }
  }

  async updateCart(userId, updatedCartData) {
    try {
      const cartToUpdate = await cartsDao.readOne({ userId });

      if (!cartToUpdate) {
        throw new Error("Cart not found");
      }

      const updatedCart = await cartsDao.updateOne(
        { userId },
        { $set: updatedCartData }
      );
      if (!updatedCart) {
        throw new Error("Failed to update cart");
      }

      const total = await this.calculateTotalPrice(cartToUpdate._id);
      return { ...updatedCart, total };
    } catch (error) {
      Logger.error("Error updating cart:", error);
      throw error;
    }
  }

  async clearCart(_id) {
    try {
      const cart = await this.readOneById(_id);

      if (!cart) {
        const error = new Error("Cart not found");
        error.type = "NOT_FOUND";
        throw error;
      }

      const updatedCart = await cartsDao.updateOne(
        { _id },
        { $set: { products: [] } }
      );

      if (!updatedCart) {
        const error = new Error("Failed to clear cart");
        error.type = "INTERNAL_ERROR";
        throw error;
      }

      Logger.info(`Cart ${_id} successfully cleared`);
      return updatedCart;
    } catch (error) {
      Logger.error("Error clearing cart:", error);
      throw error;
    }
  }

  async calculateTotalPrice(_id) {
    try {
      const cart = await this.readOneById(_id);
      if (!cart) {
        throw new Error("Cart not found");
      }

      Logger.debug("Calculating total price for cart:", cart);

      let total = 0;
      for (const item of cart.products) {
        const productPrice = item.productId?.price || 0;
        const quantity = item.quantity || 1;
        total += productPrice * quantity;
        Logger.debug(
          `Product ${
            item.productId?._id
          }: price=${productPrice}, quantity=${quantity}, subtotal=${
            productPrice * quantity
          }`
        );
      }

      Logger.debug(`Total cart price: ${total}`);
      return total;
    } catch (error) {
      Logger.error("Error calculating cart total price:", error);
      throw error;
    }
  }

  async deleteCart(_id) {
    try {
      const deletedCart = await cartsDao.deleteOne({ _id });

      if (deletedCart) {
        Logger.info("Cart deleted successfully");
        return deletedCart;
      } else {
        const error = new Error("Cart not found for deletion");
        error.type = "INVALID_ARGUMENT";
        throw error;
      }
    } catch (error) {
      Logger.error("Error deleting cart:", error);
      throw error;
    }
  }
}

export const cartsService = new CartsService();
