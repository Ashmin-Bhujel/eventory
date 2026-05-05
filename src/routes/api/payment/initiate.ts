import type { InitiatePaymentData } from "#/lib/validation/payment";

import { initiatePaymentFn } from "#/server/functions/payment";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/payment/initiate")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const requestBody: InitiatePaymentData = await request.json();

          const result = await initiatePaymentFn(requestBody);

          return new Response(JSON.stringify(result), {
            status: 200,
            headers: { "Content-Type": "application/json" },
          });
        } catch (error) {
          return new Response("Failed to initiate payment", { status: 500 });
        }
      },
    },
  },
});
