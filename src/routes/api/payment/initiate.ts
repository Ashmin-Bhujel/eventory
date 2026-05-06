import type { InitiatePaymentData } from "#/lib/zod/payment.schema";

import { initiatePaymentService } from "#/server/services/payment.service";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/payment/initiate")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const requestBody: InitiatePaymentData = await request.json();

          const result = await initiatePaymentService(requestBody);

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
