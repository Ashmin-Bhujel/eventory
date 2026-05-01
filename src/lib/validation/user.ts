import { z } from "zod";

export const userSchema = z.object({
  _id: z.string(),
  clerkId: z.string(),
  email: z.email(),
  username: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  avatarUrl: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createUserSchema = z.object({
  clerkId: z.string("Clerk ID is required"),
  email: z.email("Please provide a valid email"),
  username: z.string("Username is required"),
  firstName: z.string("First name is required"),
  lastName: z.string("Last name is required"),
  avatarUrl: z.string().optional(),
});

export const updateUserSchema = z.object({
  clerkId: z.string("Clerk ID is required"),
  username: z.string("Username is required").optional(),
  firstName: z.string("First name is required").optional(),
  lastName: z.string("Last name is required").optional(),
  avatarUrl: z.string().optional(),
});

export const deleteUserSchema = z.object({
  clerkId: z.string("Clerk ID is required"),
});

export type User = z.infer<typeof userSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type DeleteUserInput = z.infer<typeof deleteUserSchema>;
