import { createUserSchema, deleteUserSchema, updateUserSchema } from "#/lib/validation/user.ts";
import { createUserFn, deleteUserFn, updateUserFn } from "#/server/functions/user.ts";
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

            const createdUser = await createUserFn({ data });

            if (!createdUser) {
              return new Response("Error creating user", { status: 500 });
            }

            await clerkClient().users.updateUserMetadata(id, {
              publicMetadata: {
                userId: createdUser._id,
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

            const updatedUser = await updateUserFn({ data });

            if (!updatedUser) {
              return new Response("Error updating user", { status: 500 });
            }
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

            const deletedUser = await deleteUserFn({ data });

            if (!deletedUser) {
              return new Response("Error deleting user", { status: 500 });
            }
          }

          console.log("Received Clerk webhook event of type:", eventType);
          return new Response("Webhook received", { status: 200 });
        } catch (err) {
          console.error("Error verifying webhook:", err);
          return new Response("Error verifying webhook", { status: 400 });
        }
      },
    },
  },
});
