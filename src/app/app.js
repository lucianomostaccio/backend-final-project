// Express application setup
import express from "express";
import { webRouter } from "../routers/web/web.router.js";
import { apiRouter } from "../routers/api/api.router.js";
import { engine } from "express-handlebars";
import * as handlebarsHelpers from "../helpers/handlebarsHelpers.js";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { cookies } from "../middlewares/cookies.js";
import { addCartQuantityToLocals } from "../middlewares/cartQuantity.js";
import { authenticateWithJwt } from "../middlewares/authentication.js";
import { addImagePathToLocals } from "../middlewares/imagePath.js";
import { errorsHandler } from "../middlewares/errorsHandler.js";
import { handlebarsPagesError } from "../middlewares/handlebarsError.js";
import { improvedReplies } from "../middlewares/improvedReplies.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const app = express();

// Handlebars engine & templates setup
app.engine(
  "handlebars",
  engine({
    helpers: handlebarsHelpers,
  })
);
const appViewsPath = path.join(__dirname, "..", "views");
app.set("views", appViewsPath);
app.set("view engine", "handlebars");

// Request parsing and basic middleware
app.use(cookies);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "..", "static")));

// Authentication and context middleware
app.use(authenticateWithJwt);
app.use(addCartQuantityToLocals);
app.use(addImagePathToLocals);
app.use(improvedReplies);

// Routers
app.use("/", webRouter);
app.use("/api", apiRouter);

// Error handling middleware - must be after routes
app.use(errorsHandler);

// 404 error handler for pages - must be last
app.use(handlebarsPagesError);
