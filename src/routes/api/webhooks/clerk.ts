import { createUserSchema, deleteUserSchema, updateUserSchema } from "#/lib/zod/user.schema";
import {
  createUserService,
  deleteUserService,
  updateUserService,
} from "#/server/services/user.service";
import { clerkClient } from "@clerk/tanstack-react-start/server";
import { verifyWebhook } from "@clerk/tanstack-react-start/webhooks";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/webhooks/clerk")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const evt = await verifyWebhook(request);

          const eventType = evt.type;

          // Handle user.created event
          if (eventType === "user.created") {
            const { id, email_addresses, image_url, first_name, last_name, username } = evt.data;

            const { success, data, error } = createUserSchema.safeParse({
              clerkId: id,
              email: email_addresses[0].email_address,
              username,
              firstName: first_name,
              lastName: last_name,
              avatarUrl: image_url,
            });

            if (!success) {
              console.error("Validation error:", error.issues);
              return new Response("Invalid user data", { status: 400 });
            }

            const createdUser = await createUserService(data);

            await clerkClient().users.updateUserMetadata(id, {
              publicMetadata: {
                userId: createdUser._id.toString(),
              },
            });
          }

          // Handle user.updated event
          if (eventType === "user.updated") {
            const { id, image_url, first_name, last_name, username } = evt.data;

            const { success, data, error } = updateUserSchema.safeParse({
              clerkId: id,
              firstName: first_name,
              lastName: last_name,
              username: username,
              avatarUrl: image_url,
            });

            if (!success) {
              console.error("Validation error:", error.issues);
              return new Response("Invalid user data", { status: 400 });
            }

            await updateUserService(data);
          }

          // Handle user.deleted event
          if (eventType === "user.deleted") {
            const { id } = evt.data;

            const { success, data, error } = deleteUserSchema.safeParse({
              clerkId: id,
            });

            if (!success) {
              console.error("Validation error:", error.issues);
              return new Response("Invalid user data", { status: 400 });
            }

            await deleteUserService(data);
          }

          console.log("Received Clerk webhook event of type:", eventType);
          return new Response("Webhook received", { status: 200 });
        } catch (err) {
          if (err instanceof Error) {
            console.error("Error verifying webhook:", err.message);
          } else {
            console.error("Unknown error verifying webhook");
          }

          return new Response("Error verifying webhook", { status: 400 });
        }
      },
    },
  },
});
