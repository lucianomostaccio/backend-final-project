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
    if (!req.user) {
      Logger.error("No user found in request");
      return next(new Error("No user found in request"));
    }

    req.user = toPOJO(req.user);

    const token = await encrypt(req.user);

    res.cookie("authorization", token, cookieOpts);
    Logger.debug("Cookie set");
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
