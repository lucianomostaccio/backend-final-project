import { Schema } from "mongoose";
import { randomUUID } from "node:crypto";

import {
  DEFAULT_ROLE,
  DEFAULT_USER_AVATAR_PATH,
} from "../../../config/config.js";

export const usersSchema = new Schema(
  {
    _id: { type: String, default: randomUUID },
    email: { type: String, unique: true, required: true },
    password: { type: String, default: "(not applicable)" },
    first_name: { type: String, required: true },
    last_name: { type: String, default: "(not specified)" },
    age: { type: Number, default: null },
    profile_picture: { type: String, default: DEFAULT_USER_AVATAR_PATH },
    role: { type: String, required: true, default: DEFAULT_ROLE },
    tickets: {
      type: [
        {
          type: String,
          ref: "tickets",
        },
      ],
      default: [],
    },
    last_login: { type: Date },
  },
  {
    strict: "throw",
    versionKey: false,
  }
);
