import { Router } from "express";

export const contactRouter = Router();

contactRouter.get("/contact", async (req, res) => {
  res.render("contact.handlebars", {
    ...req.user,
    pageTitle: "Contact Us",
  });
});
