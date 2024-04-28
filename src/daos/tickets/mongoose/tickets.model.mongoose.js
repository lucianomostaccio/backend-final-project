import { Schema } from "mongoose";
import { randomUUID } from "node:crypto";

export const ticketsSchema = new Schema(
  {
    _id: { type: String, default: randomUUID },
    code: {
      type: [String],
      unique: true,
    },
    ticketDate: {
      type: Date,
      default: Date.now,
    },
    amount: {
      type: Number,
    },
    purchaser: {
      type: String,
    },
  },
  {
    versionKey: false, // Disables the __v version key on MongoDB documents
  }
);
