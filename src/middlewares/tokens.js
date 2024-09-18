import { encrypt } from "../utils/hashing.js";
import { toPOJO } from "../daos/utils.js";
import Logger from "../utils/logger.js";

const cookieOpts = {
  httpOnly: true,
  maxAge: 1000 * 60 * 60 * 24 /* 1 day */,
  signed: true,
};

export async function tokenizeUserInCookie(req, res, next) {
  try {
    console.log("Starting tokenizeUserInCookie");
    console.log("req.user:", req.user);

    if (!req.user) {
      console.log("No user found in request");
      return next(new Error("No user found in request"));
    }

    req.user = toPOJO(req.user);
    console.log("req.user after toPOJO", req.user);

    // const userData = {
    //   _id: req.user.user._id,
    //   email: req.user.user.email,
    //   first_name: req.user.user.first_name,
    //   last_name: req.user.user.last_name,
    //   role: req.user.user.role,
    //   last_login: req.user.user.last_login
    // };
    const token = await encrypt(req.user);
    console.log("Token generated:", token);

    res.cookie("authorization", token, cookieOpts);
    console.log("Cookie set");
    // res["created"]();
    next();
  } catch (error) {
    next(error);
  }
}

export function deleteTokenFromCookie(req, res, next) {
  Logger.debug("removing token from cookie with options:", cookieOpts);
  res.clearCookie("authorization", cookieOpts);
  next();
}
