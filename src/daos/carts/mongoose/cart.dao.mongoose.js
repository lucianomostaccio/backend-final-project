import Logger from "../../../utils/logger.js";
import { toPOJO } from "../../utils.js";

export class CartDaoMongoose {
  constructor(cartModel) {
    this.cartModel = cartModel;
  }

  async create(data) {
    try {
      // Ensure data includes userId
      if (!data.userId) {
        throw new Error("UserId is required to create a cart");
      }
      const cart = await this.cartModel.create(data);
      return toPOJO(cart);
    } catch (error) {
      Logger.error("Error creating cart in MongoDB:", error);
      throw error;
    }
  }

  async readOne(query) {
    try {
      const cart = await this.cartModel
        .findOne(query)
        .populate({
          path: "products.productId",
          select: "title price description",
        })
        .lean();

      Logger.debug(
        "Cart found by cartDaoMongoose:",
        JSON.stringify(cart, null, 2)
      );

      if (!cart) {
        Logger.info("Cart not found with query:", query);
        return null;
      }
      return toPOJO(cart);
    } catch (error) {
      Logger.error("Error reading cart from MongoDB:", error);
      throw error;
    }
  }

  async updateOne(query, data) {
    try {
      // Handle field stripping for Mongoose (if action is present, it will be ignored due to schema configuration)
      const updateData = { ...data };
      if (updateData.action) delete updateData.action;
      if (updateData.productId) delete updateData.productId;
      if (updateData.quantity) delete updateData.quantity;

      const updatedCart = await this.cartModel
        .findOneAndUpdate(query, updateData, { new: true })
        .lean();

      if (!updatedCart) {
        Logger.warning("Cart not found with query:", query);
        return null;
      }
      return toPOJO(updatedCart);
    } catch (error) {
      Logger.error("Error updating cart in MongoDB:", error);
      throw error;
    }
  }

  async deleteOne(query) {
    try {
      const deletedCart = await this.cartModel.findOneAndDelete(query).lean();
      if (!deletedCart) {
        Logger.warning("Cart not found for deletion with query:", query);
        return null;
      }
      return toPOJO(deletedCart);
    } catch (error) {
      Logger.error("Error deleting cart from MongoDB:", error);
      throw error;
    }
  }

  async addProductToCart(userId, productId, quantity = 1) {
    try {
      // Find the cart based on userId
      const cart = await this.cartModel.findOne({ userId }).lean();
      if (!cart) {
        Logger.warning("Cart not found for user:", userId);
        return null;
      }

      // Update cart's products array
      const productIndex = cart.products.findIndex(
        (product) =>
          product.productId &&
          (product.productId._id === productId ||
            product.productId === productId)
      );

      if (productIndex !== -1) {
        // Product already in cart, update quantity
        cart.products[productIndex].quantity += quantity;
      } else {
        // New product for this cart
        cart.products.push({ productId, quantity });
      }

      // Update the cart with the new products array
      const updatedCart = await this.cartModel
        .findOneAndUpdate(
          { userId },
          { $set: { products: cart.products } },
          { new: true }
        )
        .lean();

      if (!updatedCart) {
        Logger.error("Error updating cart for user:", userId);
        throw new Error("Error updating cart");
      }

      Logger.info("Product added to cart for user:", userId);
      return toPOJO(updatedCart);
    } catch (error) {
      Logger.error("Error adding product to cart in MongoDB:", error);
      throw error;
    }
  }
}
