import { Schema } from "mongoose";
import { randomUUID } from "node:crypto";

export const formSchema = new Schema(
  {
    _id: { type: String, default: randomUUID },
    name: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    email: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
  },
  {
    strict: "throw",
    versionKey: false,
  }
);
