import type { CreateEventInput, Event as EventType } from "#/lib/validation/event";

import { connectDb } from "#/lib/database/db";
import { Category } from "#/lib/database/models/category.model";
import { Event } from "#/lib/database/models/event.model";
import { User } from "#/lib/database/models/user.model";
import { createEventSchema } from "#/lib/validation/event";
import { createServerFn } from "@tanstack/react-start";

export const createEventFn = createServerFn({
  method: "POST",
})
  .inputValidator((data: CreateEventInput) => createEventSchema.parse(data))
  .handler(async ({ data }) => {
    try {
      connectDb();

      const organizer = await User.exists({ clerkId: data.organizer });
      console.log(data.organizer);

      if (!organizer) {
        throw new Error("Organizer not found");
      }

      const category = await Category.exists({
        name: data.category,
      });

      if (!category) {
        throw new Error("Category not found");
      }

      const newEvent = {
        ...data,
        organizer: organizer._id,
        category: category._id,
      };

      const createdEvent = await Event.create(newEvent);

      return JSON.parse(JSON.stringify(createdEvent)) as EventType;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to create event: ${error.message}`);
      } else {
        throw new Error("An unknown error occurred while creating the event");
      }
    }
  });
