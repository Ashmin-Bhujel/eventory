import type { EventFormInput } from "#/lib/zod/event.schema";

import { connectDb } from "#/lib/database/db";
import { Category } from "#/lib/database/models/category.model";
import { Event } from "#/lib/database/models/event.model";
import { User } from "#/lib/database/models/user.model";

export async function createEventService(createEventData: EventFormInput) {
  await connectDb();

  const organizer = await User.exists({ clerkId: createEventData.organizer });

  if (!organizer) {
    console.error("Organizer not found");

    return null;
  }

  const category = await Category.exists({
    name: createEventData.category,
  });

  if (!category) {
    console.error("Category not found");

    return null;
  }

  const newEvent = {
    ...createEventData,
    organizer: organizer._id.toString(),
    category: category._id.toString(),
  };

  return (await Event.create(newEvent)).toObject();
}

export async function getEventByIdService(id: string) {
  await connectDb();

  return await Event.findById(id)
    .populate({ path: "organizer", select: "firstName lastName clerkId" })
    .populate({ path: "category", select: "name" })
    .lean();
}

export async function getEventsService() {
  await connectDb();

  return await Event.find()
    .populate({ path: "organizer", select: "firstName lastName clerkId" })
    .populate({ path: "category", select: "name" })
    .lean();
}

export async function updateEventService(id: string, updateEventData: EventFormInput) {
  await connectDb();

  const organizer = await User.exists({ clerkId: updateEventData.organizer });

  if (!organizer) {
    console.error("Organizer not found");

    return null;
  }

  const category = await Category.exists({
    name: updateEventData.category,
  });

  if (!category) {
    console.error("Category not found");

    return null;
  }

  const newEvent = {
    ...updateEventData,
    organizer: organizer._id.toString(),
    category: category._id.toString(),
  };

  return await Event.findOneAndUpdate({ _id: id, organizer: organizer._id.toString() }, newEvent, {
    returnDocument: "after",
  }).lean();
}

export async function deleteEventService(id: string, clerkId: string) {
  await connectDb();

  const organizer = await User.exists({ clerkId: clerkId });

  if (!organizer) {
    console.error("Organizer not found");

    return null;
  }

  return await Event.findOneAndDelete(
    { _id: id, organizer: organizer._id.toString() },
    { returnDocument: "after" },
  ).lean();
}
