import { Schema, model } from "mongoose";
import { Event } from "./event.model";
import { User } from "./user.model";

const orderSchema = new Schema(
  {
    pidx: {
      type: String,
      required: true,
      unique: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    event: {
      type: Schema.Types.ObjectId,
      ref: Event,
    },
    buyer: {
      type: Schema.Types.ObjectId,
      ref: User,
    },
    status: {
      type: String,
      enum: [
        "Completed",
        "Pending",
        "Expired",
        "Initiated",
        "Refunded",
        "User canceled",
        "Partially Refunded",
      ],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  },
);

export const Order = model("Order", orderSchema);
