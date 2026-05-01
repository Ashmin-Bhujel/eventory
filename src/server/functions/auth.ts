import type {
  CreateUserInput,
  DeleteUserInput,
  UpdateUserInput,
  User as UserType,
} from "#/lib/validation/user.ts";

import { connectDb } from "#/lib/database/db.ts";
import { User } from "#/lib/database/models/user.model.ts";
import { createUserSchema, deleteUserSchema, updateUserSchema } from "#/lib/validation/user.ts";
import { auth } from "@clerk/tanstack-react-start/server";
import { createServerFn } from "@tanstack/react-start";

export const authStateFn = createServerFn({
  method: "GET",
}).handler(async () => {
  const { isAuthenticated, userId } = await auth();

  return {
    isAuthenticated,
    userId,
  };
});

export const createUserFn = createServerFn({
  method: "POST",
})
  .inputValidator((data: CreateUserInput) => createUserSchema.parse(data))
  .handler(async ({ data }) => {
    try {
      await connectDb();

      const createdUser = await User.create(data);

      return JSON.parse(JSON.stringify(createdUser)) as UserType;
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error creating user:", error.message);
      }

      return null;
    }
  });

export const updateUserFn = createServerFn({
  method: "POST",
})
  .inputValidator((data: UpdateUserInput) => updateUserSchema.parse(data))
  .handler(async ({ data }) => {
    try {
      await connectDb();

      const { clerkId, ...updateData } = data;

      const updatedUser = await User.findOneAndUpdate({ clerkId }, updateData, {
        returnDocument: "after",
      });

      if (!updatedUser) {
        console.error("User not found for update:", clerkId);
        return null;
      }

      return JSON.parse(JSON.stringify(updatedUser)) as UserType;
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error updating user:", error.message);
      }

      return null;
    }
  });

export const deleteUserFn = createServerFn({
  method: "POST",
})
  .inputValidator((data: DeleteUserInput) => deleteUserSchema.parse(data))
  .handler(async ({ data }) => {
    try {
      await connectDb();

      const deletedUser = await User.findOneAndDelete(
        { clerkId: data.clerkId },
        { returnDocument: "after" },
      );

      if (!deletedUser) {
        console.error("User not found for deletion:", data.clerkId);
        return null;
      }

      return JSON.parse(JSON.stringify(deletedUser)) as UserType;
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error deleting user:", error.message);
      }

      return null;
    }
  });
