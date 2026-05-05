import type {
  CreateUserInput,
  DeleteUserInput,
  UpdateUserInput,
  User as UserType,
} from "#/lib/validation/user.ts";

import { connectDb } from "#/lib/database/db.ts";
import { Event } from "#/lib/database/models/event.model.ts";
import { Order } from "#/lib/database/models/order.model.ts";
import { User } from "#/lib/database/models/user.model.ts";
import { createUserSchema, deleteUserSchema, updateUserSchema } from "#/lib/validation/user.ts";

export async function createUserFn({ data }: { data: CreateUserInput }) {
  try {
    const createUserData = createUserSchema.parse(data);

    await connectDb();

    const createdUser = await User.create(createUserData);

    return JSON.parse(JSON.stringify(createdUser)) as UserType;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error creating user:", error.message);
    } else {
      console.error("Unknown error creating user:", error);
    }

    return null;
  }
}

export async function updateUserFn({ data }: { data: UpdateUserInput }) {
  try {
    const updateUserData = updateUserSchema.parse(data);

    await connectDb();

    const { clerkId, ...updateData } = updateUserData;

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
    } else {
      console.error("Unknown error updating user:", error);
    }

    return null;
  }
}

export async function deleteUserFn({ data }: { data: DeleteUserInput }) {
  try {
    const deleteUserData = deleteUserSchema.parse(data);

    await connectDb();

    const userToDelete = await User.findOne({ clerkId: deleteUserData.clerkId });

    if (!userToDelete) {
      console.error("User not found for deletion:", deleteUserData.clerkId);
      return null;
    }

    await Promise.all([
      Event.updateMany(
        { organizer: userToDelete._id },
        {
          $unset: { organizer: 1 },
        },
      ),

      Order.updateMany({ buyer: userToDelete._id }, { $unset: { buyer: 1 } }),
    ]);

    const deletedUser = await User.findOneAndDelete(
      { clerkId: deleteUserData.clerkId },
      { returnDocument: "after" },
    );

    if (!deletedUser) {
      console.error("User not found for deletion:", deleteUserData.clerkId);
      return null;
    }

    return JSON.parse(JSON.stringify(deletedUser)) as UserType;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error deleting user:", error.message);
    } else {
      console.error("Unknown error deleting user:", error);
    }

    return null;
  }
}
