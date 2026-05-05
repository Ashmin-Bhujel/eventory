import { connectDb } from "#/lib/database/db";
import { updateOrderStatusFn } from "#/server/functions/order";
import { verifyPaymentFn } from "#/server/functions/payment";
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
          const verifyResult = await verifyPaymentFn(pidx);

          await connectDb();

          const updatedOrder = await updateOrderStatusFn({
            data: { pidx: verifyResult.pidx, status: verifyResult.status },
          });

          if (!updatedOrder) {
            throw new Error("Failed to update order status based on payment verification");
          }

          // Redirect to events page after successful verification and order update
          return new Response(null, {
            status: 302,
            headers: {
              Location: "/events",
            },
          });
        } catch (error) {
          if (error instanceof Error) {
            console.error("Error verifying payment:", error.message);

            return new Response(`Error verifying payment: ${error.message}`, { status: 500 });
          } else {
            console.error("Unknown error verifying payment");

            return new Response("Unknown error verifying payment", { status: 500 });
          }
        }
      },
    },
  },
});
