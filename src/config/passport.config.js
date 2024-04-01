// import passport from "passport";
// import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
// import { getDaoUsers } from "../daos/users/users.dao.js";
// import { JWT_PRIVATE_KEY } from "../config/config.js";
// import Logger from "../utils/logger.js";

// const opts = {
//   jwtFromRequest: ExtractJwt.fromSignedCookie("authorization"), // Extract JWT from signed cookie
//   secretOrKey: JWT_PRIVATE_KEY,
// };

// passport.use(
//   new JWTStrategy(opts, async (jwtPayload, done) => {
//     try {
//       Logger.debug('JWT payload:', jwtPayload); // Log the payload for inspection
//       const usersDao = getDaoUsers();
//       const user = await usersDao.readOne({ _id: jwtPayload.userId });

//       if (user) {
//         return done(null, user); // Successful authentication
//       } else {
//         return done(null, false); // User not found
//       }
//     } catch (error) {
//       Logger.error('Error during JWT authentication:', error); // Log errors
//       return done(error); // Error during authentication
//     }
//   })
// );

// const initializePassport = () => {
//   passport.use('jwt', passport.authenticate('jwt', { session: false }));
// };


// export default initializePassport;
