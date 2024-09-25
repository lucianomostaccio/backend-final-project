import { Router } from "express";
import { getDaoCarts } from "../../daos/carts/cart.dao.js";
import { getDaoProducts } from "../../daos/products/products.dao.js";
import { authenticateWithJwt } from "../../middlewares/authentication.js";
import Logger from "../../utils/logger.js";

export const webCartsRouter = Router();

webCartsRouter.get("/cart", authenticateWithJwt, async (req, res) => {
  if (!req.user) {
    Logger.warning("req.user does not exist for cart page, redirect");
    res.redirect("/login");
  } else {
    Logger.debug("req.user exists in carts web router");

    // Load carts directly, or change it to use a database
    const daoCarts = getDaoCarts();
    const daoProducts = getDaoProducts();
    // @ts-ignore
    const productsInCart = await daoCarts.readOne({ userId: req.user._id });

    let total = 0;
    let cartId = null;
    let productsWithThumbnails = [];

    if (productsInCart) {
      for (let product of productsInCart.products) {
        const productDetails = await daoProducts.readOne({
          _id: product.productId,
        });
        if (productDetails) {
          productsWithThumbnails.push({
            ...product,
            thumbnails: productDetails.thumbnails,
          });
          total += productDetails.price * product.quantity;
        }
      }
      cartId = productsInCart._id;
    } else {
      Logger.error("No cart found for user");
    }

    res.render("cart.handlebars", {
      ...req.user,
      pageTitle: "Cart",
      products: productsWithThumbnails,
      cartId,
      total,
      style: "cart.css",
    });
  }
});
