import express from "express";
import { webRouter } from "../routers/web/web.router.js";
import { apiRouter } from "../routers/api/api.router.js";
import { engine } from "express-handlebars";
import * as handlebarsHelpers from "../helpers/handlebarsHelpers.js";
// import cors from 'cors';
// import { sessions } from "../middlewares/sessions.js";
// import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import passport from "passport";
// import initializePassport from "../config/passport.config.js";
// import initializeGithubPassport from "../config/githubpassport.config.js";
import errorMiddleware from "../middlewares/errorMiddleware.js";
import { cookies } from "../middlewares/cookies.js";
import { authentication } from "../middlewares/authentication.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// @ts-ignore
export const app = express();

// handlebars engine & templates:
app.engine(
  "handlebars",
  engine({
    helpers: handlebarsHelpers,
  })
);
const appViewsPath = path.join(__dirname, "..", "views");
app.set("views", appViewsPath);

app.set("view engine", "handlebars");

// middlewares
app.use(cookies);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "..", "static"))); //specify static folder
// app.use(cookieParser());
// app.use(sessions);
app.use(authentication);
// initializePassport();
// initializeGithubPassport();
app.use(errorMiddleware);
// app.use(cors())

// routers
app.use("/", webRouter);
app.use("/api", apiRouter);
