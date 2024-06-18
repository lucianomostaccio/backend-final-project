import { Router } from "express";
// import { rolesOnly } from "../../middlewares/authorization.js";
import { getDaoProducts } from "../../daos/products/products.dao.js";
import { authenticateWithJwt } from "../../middlewares/authentication.js";
import Logger from "../../utils/logger.js";

export const webProductsRouter = Router();

// webProductsRouter.get("/products", authenticateWithJwt, async (req, res) => {
//   if (!req.user) {
//     Logger.debug("req.user does not exist for products page, redirect");
//     res.redirect("/login");
//   } else {
//     Logger.debug("req.user exists in products web router", req.user);
//     // Load products directly, or change it to use a database
//     const daoProducts = getDaoProducts();
//     const products = await daoProducts.readMany({}, { title: 1 });
//     res.render("products.handlebars", {
//       welcomeMessage: "Welcome",
//       ...req.user,
//       pageTitle: "Products",
//       products,
//       style: "products.css",
//     });
//   }
// });

webProductsRouter.get("/products", async (req, res) => {
    const daoProducts = getDaoProducts();
    console.log("req user in /products web router:",req.user)
    const products = await daoProducts.readMany({}, { title: 1 });
    res.render("products.handlebars", {
      welcomeMessage: "Welcome",
      ...req.user,
      pageTitle: "Products",
      products,
      style: "products.css",
    });
  }
);
