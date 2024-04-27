import { Router } from "express";
import { authenticateWithJwt } from "../../middlewares/authentication.js";
import { getDaoUsers } from "../../daos/users/users.dao.js";
// import { rolesOnly } from "../../middlewares/authorization.js";

export const adminRouter = Router();

adminRouter.get("/admin", authenticateWithJwt, async (req, res) => {
    console.log("req.user in adming router", req.user);
    // @ts-ignore
    if (req.user.role === "admin") {
      console.log("admin user detected");
      const usersDao = getDaoUsers();
      const allUsers = await usersDao.readMany();
      console.log("all users", allUsers);
      res.render("admin.handlebars", { 
        pageTitle: "Admin",
        allUsers,
      });
    } else {
      console.log("not an admin")
      res.redirect("/products");
    }
  });
  