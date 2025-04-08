import { Schema } from "mongoose";
import { randomUUID } from "node:crypto";

const productItemSchema = new Schema(
  {
    productId: { type: String, ref: "products" },
    quantity: { type: Number, required: true },
  },
  { _id: false }
);

export const cartSchema = new Schema(
  {
    _id: { type: String, default: randomUUID },
    userId: { type: String, ref: "users", required: true },
    products: [productItemSchema],
  },
  {
    strict: false, // Changed from "throw" to false to allow additional fields like "action"
    versionKey: false,
  }
);
