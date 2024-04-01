import { Router } from "express";
// import { rolesOnly } from "../../middlewares/authorization.js";
import { getDaoProducts } from "../../daos/products/products.dao.js";
import { authenticateWithJwt } from "../../middlewares/authentication.js";

export const webProductsRouter = Router();

// webProductsRouter.get("/products", rolesOnly, async (req, res) => {
webProductsRouter.get("/products", authenticateWithJwt, async (req, res) => {
  if (!req.user) {
    console.log("req.user does not exist for products page, redirect");
    res.redirect("/login");
  } else {
    console.log("req.user exists in products web router", req.user);
    // Load products directly, or change it to use a database
    const daoProducts = getDaoProducts();
    const products = await daoProducts.readMany();
    // console.log("products listed:", products)
    res.render("products.handlebars", {
      welcomeMessage: "Welcome",
      ...req.user,
      pageTitle: "Products",
      products,
      style: "products.css",
    });
  }
});
