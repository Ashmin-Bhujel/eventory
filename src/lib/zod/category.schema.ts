import { z } from "zod";

export const categorySchema = z.object({
  _id: z.string(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createCategorySchema = z.object({
  name: z.string().trim().min(2, "Category name must be at least 2 characters long"),
});

export type Category = z.infer<typeof categorySchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
