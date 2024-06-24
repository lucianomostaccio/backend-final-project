import { Router } from "express";
import { getDaoProducts } from "../../daos/products/products.dao.js";
// import Logger from "../../utils/logger.js";

export const webProductsRouter = Router();

webProductsRouter.get("/products", async (req, res) => {
  const daoProducts = getDaoProducts();
  console.log("req user in /products web router:", req.user);
  let products = await daoProducts.readMany({}, { title: 1 });

  res.render("products.handlebars", {
    ...req.user,
    pageTitle: "All Products",
    products,
  });
});
