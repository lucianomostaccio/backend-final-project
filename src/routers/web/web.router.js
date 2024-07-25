import { Router } from "express";
import { webHomeRouter } from "./home.router.js";
import { webProductsRouter } from "./products.router.js";
import { webUsersRouter } from "./users.router.js";
import { sessionsRouter } from "./sessions.router.js";
import { adminRouter } from "./admin.router.js";
import Logger from "../../utils/logger.js";
import { webCartsRouter } from "./cart.router.js";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";
import { SWAGGER_CONFIG } from "../../config/config.js";
import { contactRouter } from "./contact.router.js";

export const webRouter = Router();

webRouter.use(webHomeRouter);
webRouter.use(webProductsRouter);
webRouter.use(webUsersRouter);
webRouter.use(sessionsRouter);
webRouter.use(webCartsRouter);
webRouter.use(adminRouter);
webRouter.use(contactRouter);

webRouter.get("/", (req, res) => {
  Logger.debug("Root route accessed");
  res.redirect("/home");
});

const spec = swaggerJsdoc(SWAGGER_CONFIG);
webRouter.use(
  "/api-docs",
  swaggerUiExpress.serve,
  swaggerUiExpress.setup(spec)
);
