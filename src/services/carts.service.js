import { Cart } from "../models/carts.model.js";
import { getDaoCarts } from "../daos/carts/cart.dao.js";
import Logger from "../utils/logger.js";

const cartsDao = getDaoCarts();

class CartsService {
  // Add cart to the database
  async addCart(cartData) {
    const cart = new Cart(cartData);
    const savedCart = await cartsDao.create(cart.toPOJO());
    return savedCart;
  }

  async readOne(userId) {
    return await cartsDao.readOne({ userId });
  }

  // Get cart by ID
  async readOneById(id) {
    return await cartsDao.readOne({ _id: id });
  }

  // Add product to a specific cart
  async addProductToCart(userId, productId) {
    console.log(
      "Adding product to cart for user:",
      userId,
      "Product:",
      productId
    );

    // First, find the user's cart by userId
    let cart = await cartsDao.readOne({ userId });
    console.log("Cart before adding product:", cart);

    // If the cart doesn't exist, create a new one for the user
    if (!cart) {
      cart = await cartsDao.create({ userId, products: [] });
      console.log("New cart created for user:", userId);
    }

    // Diagnostic logging to see the product ID being added
    console.log("Attempting to add product with ID:", productId);

    // Find if the product already exists in the cart
    const productIndex = cart.products.findIndex((product) => {
      // Diagnostic logging for comparison
      console.log("Comparing with product in cart with ID:", product.productId);
      return product.productId._id === productId;
    });

    // If the product is found in the cart, increment its quantity
    if (productIndex !== -1) {
      cart.products[productIndex].quantity += 1;
    } else {
      // If the product is new to the cart, add it with an initial quantity of 1
      cart.products.push({ productId: productId, quantity: 1 });
    }

    // Update the cart in the database
    const updatedCart = await cartsDao.updateOne(
      { _id: cart._id },
      { $set: { products: cart.products } }
    );
    console.log("Product added to the cart");
    return updatedCart;
  }

  async deleteProductFromCart(userId, productId) {
    console.log(
      "Modifying product quantity in cart for user:",
      userId,
      "Product:",
      productId
    );
    const cart = await cartsDao.readOne({ userId });

    if (!cart) {
      throw new Error("Cart not found");
    }

    const productIndex = cart.products.findIndex((product) => {
      // Diagnostic logging for comparison
      console.log("Comparing with product in cart with ID:", product.productId);
      return product.productId._id === productId;
    });

    if (productIndex === -1) {
      throw new Error("Product not found in cart");
    }

    if (cart.products[productIndex].quantity > 1) {
      // If more than one unit, decrement the quantity
      cart.products[productIndex].quantity -= 1;
    } else {
      // If only one unit, remove the product from the cart
      cart.products.splice(productIndex, 1);
    }

    const updatedCart = await cartsDao.updateOne(
      { _id: cart._id },
      { $set: { products: cart.products } }
    );

    if (!updatedCart) {
      throw new Error("Failed to update cart");
    }

    console.log("Product quantity updated in cart");
    return updatedCart;
  }

  async removeWholeProductFromCart(userId, productId) {
    console.log(
      "removing product from cart for user:",
      userId,
      "Product:",
      productId
    );
    const cart = await cartsDao.readOne({ userId });

    if (!cart) {
      throw new Error("Cart not found");
    }

    const productIndex = cart.products.findIndex((product) => {
      // Diagnostic logging for comparison
      console.log("Comparing with product in cart with ID:", product.productId);
      return product.productId._id === productId;
    });

    if (productIndex === -1) {
      throw new Error("Product not found in cart");
    }

    cart.products.splice(productIndex, 1);

    const updatedCart = await cartsDao.updateOne(
      { _id: cart._id },
      { $set: { products: cart.products } }
    );

    if (!updatedCart) {
      throw new Error("Failed to update cart");
    }

    console.log("Product removed from cart");
    return updatedCart;
  }

  // Update cart by ID
  async updateCart(userId, updatedCartData) {
    console.log("Updating cart for user:", userId);
    try {
      const cartToUpdate = await cartsDao.readOne({ userId });

      if (!cartToUpdate) {
        throw new Error("Cart not found");
      }

      Object.assign(cartToUpdate, updatedCartData);

      const updatedCart = await cartsDao.updateOne({ userId }, cartToUpdate);
      console.log("Cart updated");
      return updatedCart;
    } catch (error) {
      Logger.error("Error updating cart:", error);
      throw error;
    }
  }

  async calculateTotalPrice(_id) {
    console.log("id received in calculate", _id);
    const cart = await this.readOneById(_id);
    if (!cart) {
      throw new Error("Cart not found");
    }

    let totalPrice = 0;
    console.log("cart.products", cart.products);
    cart.products.forEach((product) => {
      totalPrice += product.quantity * product.productId.price;
    });

    return totalPrice;
  }

  // Delete cart by ID
  async deleteCart(_id) {
    try {
      const deletedCart = await cartsDao.deleteOne({ _id });

      if (deletedCart) {
        Logger.info("Product deleted:", deletedCart);
        return deletedCart;
      } else {
        Logger.error("Cart not found for deletion");
        return null;
      }
    } catch (error) {
      Logger.error("Error deleting cart:", error);
      throw error;
    }
  }
}

export const cartsService = new CartsService();
