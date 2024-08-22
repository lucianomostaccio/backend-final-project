import { usersService } from "../services/index.js";
import Logger from "../utils/logger.js";
import passport from "passport";

export const sessionsPost = async (req, res, next) => {
  try {
    console.log("session post");
    const { email, password } = req.body;
    Logger.debug(req.body);
    const user = await usersService.authenticate({ email, password });
    await usersService.updateLastLogin(user._id);
    Logger.debug("user authenticated", user);
    req.user = user;
    next();
  } catch (error) {
    console.log("error in sessionsPost:", error);
    next(error);
  }
};

export const githubSessionsPost = (req, res, next) => {
  passport.authenticate(
    "github",
    { session: false, failureRedirect: "/login" },
    (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.redirect("/login");
      }
     
      req.user = user;
      return next(); // Continue to tokenizeUserInCookie middleware
    }
  )(req, res, next);
};
