import { encrypt } from '../utils/hashing.js'
import { toPOJO } from "../daos/utils.js";

const cookieOpts = {
  httpOnly: true, maxAge: 1000 * 60 * 60 * 24 /* 1 day */, signed: true
}

export async function tokenizeUserInCookie(req, res, next) {
  try {
    console.log("req.user obtained in tokenize user:", req.user)
    req.user = toPOJO(req.user)
    console.log("req.user after toPOJO", req.user)
    
    const token = await encrypt(req.user)
    console.log("token:",token)
    res.cookie('authorization', token, cookieOpts)
    // res.status(201).json({ payload: req.user });
    res['created'](req.user);
  } catch (error) {
    next(error)
  }
}

export function deleteTokenFromCookie(req, res, next) {
  console.log("removing token from cookie with options:", cookieOpts)
  res.clearCookie('authorization', cookieOpts)
  next()
}
