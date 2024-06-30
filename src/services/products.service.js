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

  // async getFilteredAndSortedProducts(filters = {}, sort = "") {
  //   try {
  //     let query = {};

  //     if (filters.categories && filters.categories.length > 0) {
  //       query.category = { $in: filters.categories };
  //     }
  //     if (filters.featured) {
  //       query.featured = true;
  //     }
  //     if (filters.trending) {
  //       query.trending = true;
  //     }

  //     let sortOption = {};
  //     if (sort) {
  //       switch (sort) {
  //         case "price-asc":
  //           sortOption = { price: 1 };
  //           break;
  //         case "price-desc":
  //           sortOption = { price: -1 };
  //           break;
  //         case "name-asc":
  //           sortOption = { title: 1 };
  //           break;
  //         case "name-desc":
  //           sortOption = { title: -1 };
  //           break;
  //       }
  //     }

  //     const products = await productsDao.readMany(query, {}, sortOption);
  //     return products;
  //   } catch (error) {
  //     Logger.error("Error fetching filtered and sorted products:", error);
  //     throw error;
  //   }
  // }

  // async getCategories() {
  //   try {
  //     const categories = await productsDao.distinct("category");
  //     return categories;
  //   } catch (error) {
  //     Logger.error("Error fetching categories:", error);
  //     throw error;
  //   }
  // }
}

export const productsService = new ProductsService();
