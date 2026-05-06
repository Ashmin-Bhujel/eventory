import { updateOrderStatusService } from "#/server/services/order.service";
import { verifyPaymentService } from "#/server/services/payment.service";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/payment/verify")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const url = new URL(request.url);

        const pidx = url.searchParams.get("pidx");

        if (!pidx) {
          return new Response("Missing pidx query parameter", { status: 400 });
        }

        try {
          const verifyResult = await verifyPaymentService(pidx);

          const updatedOrder = await updateOrderStatusService({
            pidx: verifyResult.pidx,
            status: verifyResult.status,
          });

          if (!updatedOrder) {
            throw new Error("Failed to update order status based on payment verification");
          }

          return new Response(null, {
            status: 302,
            headers: {
              Location: "/profile",
            },
          });
        } catch (error) {
          if (error instanceof Error) {
            return new Response(`Error verifying payment: ${error.message}`, { status: 500 });
          } else {
            return new Response("Unknown error verifying payment", { status: 500 });
          }
        }
      },
    },
  },
});
