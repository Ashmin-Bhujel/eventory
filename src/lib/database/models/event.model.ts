import { Schema, model } from "mongoose";
import { Category } from "./category.model";
import { User } from "./user.model";

const eventSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    location: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      default: Date.now,
    },
    price: {
      type: Number,
      default: 0,
    },
    isFree: {
      type: Boolean,
      default: false,
    },
    url: {
      type: String,
    },
    organizer: {
      type: Schema.Types.ObjectId,
      ref: User,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: Category,
    },
  },
  { timestamps: true },
);

export const Event = model("Event", eventSchema);
