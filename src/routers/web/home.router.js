import { Router } from "express";
import { getDaoProducts } from "../../daos/products/products.dao.js";
// import Logger from "../../utils/logger.js";

export const webHomeRouter = Router();

webHomeRouter.get("/home", async (req, res) => {
  const daoProducts = getDaoProducts();
  console.log("req user in /home web router:", req.user);
  let products = await daoProducts.readMany({}, { title: 1 });

  res.render("home.handlebars", {
    ...req.user,
    pageTitle: "LDM Store - Home",
    products,
  });
});
