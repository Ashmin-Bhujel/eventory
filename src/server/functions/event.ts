import type { EventFormInput, EventResponse, Event as EventType } from "#/lib/validation/event";

import { connectDb } from "#/lib/database/db";
import { Category } from "#/lib/database/models/category.model";
import { Event } from "#/lib/database/models/event.model";
import { User } from "#/lib/database/models/user.model";
import { eventFormSchema } from "#/lib/validation/event";
import { auth } from "@clerk/tanstack-react-start/server";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const createEventFn = createServerFn({
  method: "POST",
})
  .inputValidator((data: EventFormInput) => eventFormSchema.parse(data))
  .handler(async ({ data }) => {
    try {
      const { userId } = await auth();

      if (!userId) {
        throw new Error("Unauthorized");
      }

      await connectDb();

      const organizer = await User.exists({ clerkId: userId });

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

export const getEventByIdFn = createServerFn({
  method: "GET",
})
  .inputValidator((data: { id: string }) => z.object({ id: z.string() }).parse(data))
  .handler(async ({ data }) => {
    try {
      await connectDb();

      const event = await Event.findById(data.id)
        .populate({ path: "organizer", select: "firstName lastName clerkId" })
        .populate({ path: "category", select: "name" });

      if (!event) {
        console.error(`Event with ID ${data.id} not found`);

        return null;
      }

      return JSON.parse(JSON.stringify(event)) as EventResponse;
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error fetching event with ID ${data.id}: ${error.message}`);
      } else {
        console.error(`Unknown error fetching event with ID ${data.id}`);
      }

      return null;
    }
  });

export const getEventsFn = createServerFn({
  method: "GET",
}).handler(async () => {
  try {
    await connectDb();

    const events = await Event.find()
      .populate({ path: "organizer", select: "firstName lastName clerkId" })
      .populate({ path: "category", select: "name" });

    return JSON.parse(JSON.stringify(events)) as EventResponse[];
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error fetching events: ${error.message}`);
    } else {
      console.error("Unknown error fetching events");
    }

    return [];
  }
});

export const updateEventFn = createServerFn({
  method: "POST",
})
  .inputValidator((data: { eventId: string; formData: EventFormInput }) =>
    z
      .object({
        eventId: z.string(),
        formData: eventFormSchema,
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    try {
      const { userId } = await auth();

      if (!userId) {
        throw new Error("Unauthorized");
      }

      await connectDb();

      const organizer = await User.exists({ clerkId: userId });

      if (!organizer) {
        throw new Error("Organizer not found");
      }

      const category = await Category.exists({
        name: data.formData.category,
      });

      if (!category) {
        throw new Error("Category not found");
      }

      const newEvent = {
        ...data.formData,
        organizer: organizer._id,
        category: category._id,
      };

      const updatedEvent = await Event.findOneAndUpdate(
        { _id: data.eventId, organizer: organizer._id },
        newEvent,
        {
          returnDocument: "after",
        },
      );

      if (!updatedEvent) {
        throw new Error("Event not found or not authorized");
      }

      return JSON.parse(JSON.stringify(updatedEvent)) as EventType;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to update event: ${error.message}`);
      } else {
        throw new Error("An unknown error occurred while updating the event");
      }
    }
  });

export const deleteEventFn = createServerFn({
  method: "POST",
})
  .inputValidator((data: { id: string }) => z.object({ id: z.string() }).parse(data))
  .handler(async ({ data }) => {
    try {
      const { userId } = await auth();

      if (!userId) {
        throw new Error("Unauthorized");
      }

      await connectDb();

      const organizer = await User.exists({ clerkId: userId });

      if (!organizer) {
        throw new Error("Organizer not found");
      }
      const deletedEvent = await Event.findOneAndDelete(
        { _id: data.id, organizer: organizer._id },
        { returnDocument: "after" },
      );

      if (!deletedEvent) {
        throw new Error("Event not found or not authorized");
      }

      return JSON.parse(JSON.stringify(deletedEvent)) as EventType;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to delete event: ${error.message}`);
      } else {
        throw new Error("An unknown error occurred while deleting the event");
      }
    }
  });
