import { Product } from "../models/products.model.js";
import { getDaoProducts } from "../daos/products/products.dao.js";
import Logger from "../utils/logger.js";

const productsDao = getDaoProducts();

class ProductsService {
  async addProduct(data) {
    Logger.debug("data add product products service", data);
    const product = new Product(data);
    Logger.debug("new product(data)", product);
    const savedProduct = await productsDao.create(product.toPOJO());
    Logger.debug(
      "saved product created with toPOJO, products service",
      savedProduct
    );
    return savedProduct;
  }

  async readOne(criteria) {
    return await productsDao.readOne(criteria);
  }
  // Load products from the database
  async readMany(criteria) {
    console.log(
      "accesed readMany products service. criteria passed:",
      criteria
    );
    return await productsDao.readMany(criteria);
  }

  //Get product by ID
  async getProductById(_id) {
    return await productsDao.readOne({ _id });
  }

  // Update product by ID
  async updateProduct(_id, updatedProduct) {
    try {
      const productToUpdate = await productsDao.readOne({ _id });

      if (!productToUpdate) {
        Logger.warning("Product not found for update", { _id });
        return null;
      }

      Object.assign(productToUpdate, updatedProduct);

      await productsDao.updateOne({ _id }, productToUpdate);
      Logger.info("Product updated:", productToUpdate);
      return productToUpdate;
    } catch (error) {
      Logger.error("Error updating product:", error);
      throw error;
    }
  }

  // Delete a product
  async deleteProduct(criteria) {
    try {
      const deletedProduct = await productsDao.deleteOne(criteria);

      if (deletedProduct) {
        Logger.info("Product deleted:", deletedProduct);
        return deletedProduct;
      } else {
        Logger.error("Product not found for deletion");
        return null;
      }
    } catch (error) {
      Logger.error("Error deleting product:", error);
      throw error;
    }
  }
}

export const productsService = new ProductsService();
