import { Schema } from 'mongoose'
import { randomUUID } from "node:crypto";

import { DEFAULT_USER_AVATAR_PATH } from "../../../config/config.js";

export const usersSchema = new Schema(
  {
    _id: { type: String, default: randomUUID },
    email: { type: String, unique: true, required: true },
    password: { type: String, default: "(not applicable)" },
    first_name: { type: String, required: true },
    last_name: { type: String, default: "(not specified)" },
    age: { type: Number, default: "(not specified)" },
    profile_picture: { type: String, default: DEFAULT_USER_AVATAR_PATH },
    orders: {
      type: [
        {
          type: String,
          ref: "orders",
        },
      ],
      default: [],
    },
  },
  {
    strict: "throw",
    versionKey: false,
  }
);
