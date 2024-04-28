import { Router } from "express";
// import { rolesOnly } from "../../middlewares/authorization.js";
import { getDaoCarts } from "../../daos/carts/cart.dao.js";
import { authenticateWithJwt } from "../../middlewares/authentication.js";
import Logger from "../../utils/logger.js";

export const webCartsRouter = Router();

webCartsRouter.get("/cart", authenticateWithJwt, async (req, res) => {
  if (!req.user) {
    Logger.warning("req.user does not exist for cart page, redirect");
    res.redirect("/login");
  } else {
    Logger.debug("req.user exists in carts web router");
    // webCartsRouter.get("/cart", rolesOnly, async (req, res) => {

    // Load carts directly, or change it to use a database
    const daoCarts = getDaoCarts();
    // @ts-ignore
    const productsInCart = await daoCarts.readOne({ userId: req.user._id });

    const user = req.user;
    console.log("req.user detected in cart", req.user);
    // @ts-ignore
    console.log("req.user._id detected in cart", req.user._id);

    let total = 0;
    let cartId = null;

    if (productsInCart) {
      productsInCart.products.forEach((product) => {
        total += product.productId.price * product.quantity;
      });
      cartId = productsInCart._id;
    } else {
      console.log("No cart found for user:", user);
    }

    console.log(JSON.stringify(productsInCart, null, 2));
    res.render("cart.handlebars", {
      welcomeMessage: "Welcome",
      user,
      pageTitle: "Cart",
      products: productsInCart ? productsInCart.products : [],
      cartId,
      total,
      style: "cart.css",
    });
  }
});
