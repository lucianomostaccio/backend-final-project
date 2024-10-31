import { Router } from "express";
import { authenticateWithJwt } from "../../middlewares/authentication.js";
import { getDaoUsers } from "../../daos/users/users.dao.js";
import Logger from "../../utils/logger.js";
import { rolesOnly } from "../../middlewares/authorization.js";

export const adminRouter = Router();

adminRouter.get("/admin", authenticateWithJwt, rolesOnly("admin"), async (req, res) => {
  Logger.info("req.user in adming router", req.user);
  // @ts-ignore
  if (req.user.role === "admin") {
    Logger.info("admin user detected");
    const usersDao = getDaoUsers();
    const allUsers = await usersDao.readMany();
    Logger.debug("all users", allUsers);
    res.render("admin.handlebars", {
      pageTitle: "Admin",
      allUsers,
    });
  } else {
    Logger.warning("not an admin");
    res.redirect("/home");
  }
});
