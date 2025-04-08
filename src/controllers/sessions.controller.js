import { usersService } from "../services/index.js";
import Logger from "../utils/logger.js";
import passport from "passport";

export const sessionsPost = async (req, res, next) => {
  try {
    Logger.debug("Processing login request");
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
      const error = new Error("Email and password are required");
      error.type = "INVALID_ARGUMENT";
      return next(error);
    }

    Logger.debug("Login attempt:", { email });

    try {
      const user = await usersService.authenticate({ email, password });
      await usersService.updateLastLogin(user._id);
      Logger.debug("User authenticated successfully");
      req.user = user;
      next();
    } catch (authError) {
      // Ensure error has the correct type for error handling
      if (!authError.type) {
        authError.type = "FAILED_AUTHENTICATION";
      }
      next(authError);
    }
  } catch (error) {
    Logger.error("Error in login process:", error);

    // Ensure all errors have a type for consistent error handling
    if (!error.type) {
      error.type = "INTERNAL_ERROR";
    }
    next(error);
  }
};

export const githubSessionsPost = (req, res, next) => {
  passport.authenticate(
    "github",
    { session: false, failureRedirect: "/login" },
    (err, user, info) => {
      if (err) {
        err.type = err.type || "FAILED_AUTHENTICATION";
        return next(err);
      }
      if (!user) {
        const error = new Error("Authentication failed");
        error.type = "FAILED_AUTHENTICATION";
        return next(error);
      }

      req.user = user;
      return next(); // Continue to tokenizeUserInCookie middleware
    }
  )(req, res, next);
};
