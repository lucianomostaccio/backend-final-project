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
    Logger.debug("req.user obtained in tokenize user:", req.user);

    req.user = toPOJO(req.user);
    Logger.debug("req.user after toPOJO", req.user);

    const token = await encrypt(req.user);
    Logger.info("token:", token);
    res.cookie("authorization", token, cookieOpts);
    res["created"](req.user);
  } catch (error) {
    next(error);
  }
}

export function deleteTokenFromCookie(req, res, next) {
  Logger.debug("removing token from cookie with options:", cookieOpts);
  res.clearCookie("authorization", cookieOpts);
  next();
}
