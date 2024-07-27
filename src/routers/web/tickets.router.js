// tickets.router.js
// for checkout page

import { Router } from "express";
import { getDaoCarts } from "../../daos/carts/cart.dao.js";
import { getDaoProducts } from "../../daos/products/products.dao.js";
import { authenticateWithJwt } from "../../middlewares/authentication.js";
import Logger from "../../utils/logger.js";

export const webCheckoutRouter = Router();

webCheckoutRouter.get("/checkout", authenticateWithJwt, async (req, res) => {
  if (!req.user) {
    Logger.warning("req.user does not exist for checkout page, redirect");
    res.redirect("/login");
  } else {
    Logger.debug("req.user exists in checkout web router");

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
      Logger.warning("No cart found for user:", req.user);
    }

    res.render("checkout.handlebars", {
      ...req.user,
      pageTitle: "Checkout",
      products: productsWithThumbnails,
      cartId,
      total,
      // style: "checkout.css",
    });
  }
});
