import { Cart } from "../models/carts.model.js";
import { getDaoCarts } from "../daos/carts/cart.dao.js";
import Logger from "../utils/logger.js";

const cartsDao = getDaoCarts();

class CartsService {
  async addCart(cartData) {
    const cart = new Cart(cartData);
    return await cartsDao.create(cart.toPOJO());
  }

  async readOne(userId) {
    return await cartsDao.readOne({ userId });
  }

  async readOneById(id) {
    return await cartsDao.readOne({ _id: id });
  }

  async addProductToCart(userId, productId) {

    let cart = await this.readOne(userId);
    if (!cart) {
      cart = await cartsDao.create({ userId, products: [] });
      console.log(`New cart created for user: ${userId}`);
    }

    const productIndex = cart.products.findIndex(product => product.productId._id === productId);

    if (productIndex !== -1) {
      cart.products[productIndex].quantity += 1;
    } else {
      cart.products.push({ productId, quantity: 1 });
    }

    const updatedCart = await cartsDao.updateOne(
      { _id: cart._id },
      { $set: { products: cart.products } }
    );
    return updatedCart;
  }

  async updateProductQuantity(userId, productId, change) {
    const cart = await this.readOne(userId);

    if (!cart) {
      throw new Error("Cart not found");
    }

    const productIndex = cart.products.findIndex(product => product.productId._id === productId);

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

    return updatedCart;
  }

  async deleteProductFromCart(userId, productId) {
    return this.updateProductQuantity(userId, productId, -1);
  }

  async removeWholeProductFromCart(userId, productId) {
    return this.updateProductQuantity(userId, productId, Number.NEGATIVE_INFINITY);
  }

  async updateCart(userId, updatedCartData) {
    try {
      const cartToUpdate = await cartsDao.readOne({ userId });

      if (!cartToUpdate) {
        throw new Error("Cart not found");
      }

      const updatedCart = await cartsDao.updateOne({ userId }, { $set: updatedCartData });
      return updatedCart;
    } catch (error) {
      console.error("Error updating cart:", error);
      throw error;
    }
  }

  async calculateTotalPrice(_id) {
    const cart = await this.readOneById(_id);
    if (!cart) {
      throw new Error("Cart not found");
    }

    return cart.products.reduce((total, product) => 
      total + (product.quantity * product.productId.price), 0);
  }

  async deleteCart(_id) {
    try {
      const deletedCart = await cartsDao.deleteOne({ _id });

      if (deletedCart) {
        console.log("Cart deleted:", deletedCart);
        return deletedCart;
      } else {
        console.error("Cart not found for deletion");
        return null;
      }
    } catch (error) {
      console.error("Error deleting cart:", error);
      throw error;
    }
  }
}

export const cartsService = new CartsService();