import type { CreateUserInput, DeleteUserInput, UpdateUserInput } from "#/lib/zod/user.schema";

import { connectDb } from "#/lib/database/db";
import { Event } from "#/lib/database/models/event.model";
import { Order } from "#/lib/database/models/order.model";
import { User } from "#/lib/database/models/user.model";

export async function createUserService(createUserData: CreateUserInput) {
  try {
    await connectDb();

    const createdUser = (await User.create(createUserData)).toObject();

    return createdUser;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error creating user: ${error.message}`);
    } else {
      console.error("Unknown error creating user");
    }

    throw error;
  }
}

export async function updateUserService(updateUserData: UpdateUserInput) {
  try {
    await connectDb();

    const { clerkId, ...updateData } = updateUserData;

    const updatedUser = await User.findOneAndUpdate({ clerkId }, updateData, {
      returnDocument: "after",
    }).lean();

    if (!updatedUser) {
      throw new Error(`User not found for update: ${clerkId}`);
    }

    return updatedUser;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error updating user: ${error.message}`);
    } else {
      console.error("Unknown error updating user");
    }

    throw error;
  }
}

export async function deleteUserService(deleteUserData: DeleteUserInput) {
  try {
    await connectDb();

    const userToDelete = await User.findOne({ clerkId: deleteUserData.clerkId }).lean();

    if (!userToDelete) {
      throw new Error(`User not found for deletion: ${deleteUserData.clerkId}`);
    }

    await Promise.all([
      Event.updateMany(
        { organizer: userToDelete._id.toString() },
        {
          $unset: { organizer: 1 },
        },
      ),

      Order.updateMany({ buyer: userToDelete._id.toString() }, { $unset: { buyer: 1 } }),
    ]);

    const deletedUser = await User.findOneAndDelete(
      { clerkId: deleteUserData.clerkId },
      { returnDocument: "after" },
    ).lean();

    if (!deletedUser) {
      throw new Error(`User not found for deletion: ${deleteUserData.clerkId}`);
    }

    return deletedUser;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error deleting user: ${error.message}`);
    } else {
      console.error("Unknown error deleting user");
    }

    throw error;
  }
}
