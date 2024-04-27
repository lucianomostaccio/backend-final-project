import { Router } from "express";
import { authenticateWithJwt } from "../../middlewares/authentication.js";
// import { rolesOnly } from "../../middlewares/authorization.js";

export const adminRouter = Router();

adminRouter.get("/", authenticateWithJwt, (req, res) => {
    // @ts-ignore
    if (req.user.role === "admin") {
      console.log("admin user detected") 
      res.render("admin.handlebars", { pageTitle: "Login" });
    } else {
      res.redirect("/products");
    }
  });
  