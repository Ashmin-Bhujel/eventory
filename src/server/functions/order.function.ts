import type { GetUserOrdersInput, OrderResponse } from "#/lib/zod/order.schema";

import { getUserOrdersSchema } from "#/lib/zod/order.schema";
import { createServerFn } from "@tanstack/react-start";
import { getUserOrdersService } from "../services/order.service";

export const getUserOrdersFn = createServerFn({
  method: "GET",
})
  .inputValidator((data: GetUserOrdersInput) => getUserOrdersSchema.parse(data))
  .handler(async ({ data }) => {
    try {
      const { userId } = data;

      const userOrders = await getUserOrdersService(userId);

      return JSON.parse(JSON.stringify(userOrders)) as OrderResponse[];
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error fetching user orders: " + error.message);
      } else {
        console.error("Unknown error fetching user orders");
      }

      return [];
    }
  });
