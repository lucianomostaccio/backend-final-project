import passport from "passport";
import { Strategy as JwtStrategy } from "passport-jwt";
import { Strategy as GitHubStrategy } from "passport-github2";
import {
  JWT_PRIVATE_KEY,
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GITHUB_CALLBACK_URL,
  DEFAULT_USER_AVATAR_PATH,
  DEFAULT_ROLE,
} from "../config/config.js";
import { getDaoUsers } from "../daos/users/users.dao.js";
import { encrypt } from "../utils/hashing.js";
import Logger from "../utils/logger.js";

passport.use(
  "jwt",
  new JwtStrategy(
    {
      jwtFromRequest: function (req) {
        var token = null;
        if (
          req &&
          req["signedCookies"] &&
          req["signedCookies"]["authorization"]
        ) {
          token = req["signedCookies"]["authorization"];
        }
        return token;
      },
      secretOrKey: JWT_PRIVATE_KEY,
    },
    // Searchs for the user in the database and passes it updated to the next middleware,
    // in every request
    async (user, done) => {
      const daoUsers = getDaoUsers();
      Logger.debug("searching for authentication the user in the DB");
      if (user.email !== undefined) {
        await daoUsers
          //convert the email to an object for mongoose to search
          .readOne({ email: user.email })
          .then((user) => {
            // req.user = user;
            done(null, user);
          })
          .catch((error) => {
            done(error);
          });
      } else {
        await daoUsers
          .readOne({ email: user.user.email })
          .then((user) => {
            // req.user = user;
            done(null, user);
          })
          .catch((error) => {
            done(error);
          });
      }
    }
  )
);

passport.use(
  // @ts-ignore
  new GitHubStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: GITHUB_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      const daoUsers = getDaoUsers();
      try {
        let user = await daoUsers.readOne({ email: profile.emails[0].value });
        if (!user) {
          // Create a new user if not found
          user = await daoUsers.create({
            email: profile.emails[0].value,
            password: "",
            first_name: profile.displayName || profile.username,
            last_name: "",
            age: "",
            profile_picture:
              profile.photos[0]?.value || DEFAULT_USER_AVATAR_PATH,
            role: DEFAULT_ROLE,
            tickets: [],
            last_login: new Date(),
          });
        }
        // Generate token
        const token = await encrypt(user);
        done(null, { user, token });
      } catch (error) {
        console.error("Error in GitHub strategy:", error);
        done(error);
      }
    }
  )
);

export async function authenticateWithJwt(req, res, next) {
  // Check if the JWT token is present in the cookies
  const token = req.signedCookies.authorization;

  if (!token) {
    // If there is no token, the user is not authenticated
    // Pass it to the next middleware
    return next();
  } else {
    // If there is a token, proceed with authentication
    passport.authenticate("jwt", { failWithError: true, session: false })(
      req,
      res,
      (error) => {
        if (error) {
          // If there is an error during authentication, pass it to the next middleware
          const typedError = new Error("authentication error");
          typedError["type"] = "FAILED_AUTHENTICATION";
          console.log("error in authentication.js, error with token:", error);
          return next(typedError);
        } else {
          // If authentication is successful, pass to the next middleware
          // req.user = res;
          return next();
        }
      }
    );
  }
}

export const authentication = passport.initialize();
