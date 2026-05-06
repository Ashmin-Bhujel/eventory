import { z } from "zod";

export const eventSchema = z.object({
  _id: z.string(),
  title: z.string(),
  description: z.string(),
  location: z.string(),
  imageUrl: z.string().optional(),
  startDate: z.date(),
  endDate: z.date(),
  price: z.number(),
  isFree: z.boolean(),
  url: z.string().optional(),
  organizer: z.string(),
  category: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const eventFormSchema = z
  .object({
    title: z.string().trim().min(3, "Title must be at least 3 characters long"),
    description: z
      .string()
      .trim()
      .min(10, "Description must be at least 10 characters long")
      .max(400, "Description must be at most 400 characters long"),
    location: z.string().trim().min(2, "Location must be at least 2 characters long"),
    imageUrl: z.string("Please provide a valid image URL").trim().optional(),
    startDate: z.date("Please provide a valid start date"),
    endDate: z.date("Please provide a valid end date"),
    price: z.number("Please provide a valid price").min(0, "Price cannot be negative"),
    isFree: z.boolean("Please provide a valid boolean for isFree"),
    url: z.string("Please provide a valid URL").trim().optional(),
    organizer: z.string("Please provide a valid organizer ID"),
    category: z.string("Please provide a valid category ID"),
  })
  .refine((data) => !["", "auto"].includes(data.category), {
    error: "Please select a category",
    path: ["category"],
  })
  .refine((data) => data.endDate >= data.startDate, {
    error: "End date must be on or after start date",
    path: ["endDate"],
  })
  .refine((data) => !(data.price === 0) || data.isFree, {
    error: "Price must be greater than 0 if the event is not free",
    path: ["price"],
  });

export const eventResponseSchema = z.object({
  _id: z.string(),
  title: z.string(),
  description: z.string(),
  location: z.string(),
  imageUrl: z.string().optional(),
  startDate: z.date(),
  endDate: z.date(),
  price: z.number(),
  isFree: z.boolean(),
  url: z.string().optional(),
  organizer: z.object({
    _id: z.string(),
    clerkId: z.string(),
    firstName: z.string(),
    lastName: z.string(),
  }),
  category: z.object({
    _id: z.string(),
    name: z.string(),
  }),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const getEventsByIdSchema = z.object({ id: z.string() });

export const updateEventSchema = z.object({
  eventId: z.string(),
  formData: eventFormSchema,
});

export const deleteEventSchema = z.object({ id: z.string() });

export const getEventsByUserClerkIdSchema = z.object({ clerkId: z.string() });

export const getEventsByCategorySchema = z.object({ category: z.string() });

export type Event = z.infer<typeof eventSchema>;
export type EventFormInput = z.infer<typeof eventFormSchema>;
export type EventResponse = z.infer<typeof eventResponseSchema>;
export type GetEventsByIdInput = z.infer<typeof getEventsByIdSchema>;
export type UpdateEventInput = z.infer<typeof updateEventSchema>;
export type DeleteEventInput = z.infer<typeof deleteEventSchema>;
export type GetEventsByUserClerkIdInput = z.infer<typeof getEventsByUserClerkIdSchema>;
export type GetEventsByCategoryInput = z.infer<typeof getEventsByCategorySchema>;
