import { hashSync, compareSync, genSaltSync } from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_PRIVATE_KEY } from "../config/config.js";

export const createHash = (password) => hashSync(password, genSaltSync(10));

export const isValidPassword = (password, hashedPassword) =>
  compareSync(password, hashedPassword);

// jwt
export function encrypt(data) {
  return new Promise((resolve, reject) => {
    if (!data) {
      const typedError = new Error("nothing to jwt encode!");
      typedError["type"] = "INTERNAL_ERROR";
      return reject(typedError);
    }
    jwt.sign(data, JWT_PRIVATE_KEY, { expiresIn: "24h" }, (err, encoded) => {
      if (err) {
        const typedError = new Error(err.message);
        typedError["type"] = "INTERNAL_ERROR";
        reject(typedError);
      } else {
        resolve(encoded);
      }
    });
  });
}

export function decrypt(token) {
  return new Promise((resolve, reject) => {
    if (!token) {
      return reject(new Error("no token to decode!"));
    }
    jwt.verify(token, JWT_PRIVATE_KEY, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
}
