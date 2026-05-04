import { Schema, model } from "mongoose";
import { Event } from "./event.model";
import { User } from "./user.model";

const orderSchema = new Schema(
  {
    stripeId: {
      type: String,
      required: true,
      unique: true,
    },
    totalAmount: {
      type: String,
    },
    event: {
      type: Schema.Types.ObjectId,
      ref: Event,
    },
    buyer: {
      type: Schema.Types.ObjectId,
      ref: User,
    },
  },
  {
    timestamps: true,
  },
);

export const Order = model("Order", orderSchema);
