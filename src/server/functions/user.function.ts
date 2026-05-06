import type { GetUserByClerkIdInput, User } from "#/lib/zod/user.schema";

import { getUserByClerkIdSchema } from "#/lib/zod/user.schema";
import { createServerFn } from "@tanstack/react-start";
import { getUserByClerkIdService } from "../services/user.service";

export const getUserByClerkIdFn = createServerFn({
  method: "GET",
})
  .inputValidator((data: GetUserByClerkIdInput) => getUserByClerkIdSchema.parse(data))
  .handler(async ({ data }) => {
    try {
      const { clerkId } = data;

      const user = await getUserByClerkIdService(clerkId);

      if (!user) {
        throw new Error(`User not found with clerkId: ${clerkId}`);
      }

      return JSON.parse(JSON.stringify(user)) as User;
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error fetching user by clerkId: " + error.message);
      } else {
        console.error("Unknown error fetching user by clerkId");
      }

      return null;
    }
  });
