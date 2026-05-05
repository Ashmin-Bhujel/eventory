import type { CreateOrderInput, OrderResponse, Order as OrderType } from "#/lib/validation/order";

import { connectDb } from "#/lib/database/db";
import { Order } from "#/lib/database/models/order.model";
import { createOrderSchema } from "#/lib/validation/order";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const createOrderFn = createServerFn({
  method: "POST",
})
  .inputValidator((data: CreateOrderInput) => createOrderSchema.parse(data))
  .handler(async ({ data }) => {
    try {
      await connectDb();

      const createdOrder = await Order.create(data);

      return JSON.parse(JSON.stringify(createdOrder)) as OrderType;
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error creating order:", error.message);
      } else {
        console.error("Unknown error creating order");
      }

      return null;
    }
  });

export const updateOrderPidxFn = createServerFn({
  method: "POST",
})
  .inputValidator((data: { orderId: string; pidx: string }) =>
    z.object({ orderId: z.string(), pidx: z.string() }).parse(data),
  )
  .handler(async ({ data }) => {
    try {
      await connectDb();

      const { orderId, pidx } = data;

      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { pidx },
        { returnDocument: "after" },
      );

      if (!updatedOrder) {
        throw new Error("Order not found");
      }

      return JSON.parse(JSON.stringify(updatedOrder)) as OrderType;
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error updating order pidx:", error.message);
      } else {
        console.error("Unknown error updating order pidx");
      }

      return null;
    }
  });

export const updateOrderStatusFn = createServerFn({
  method: "POST",
})
  .inputValidator((data: { pidx: string; status: OrderType["status"] }) =>
    z
      .object({
        pidx: z.string(),
        status: z.enum([
          "Completed",
          "Pending",
          "Expired",
          "Initiated",
          "Refunded",
          "User canceled",
          "Partially Refunded",
        ]),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    try {
      await connectDb();

      const { pidx, status } = data;

      const updatedOrder = await Order.findOneAndUpdate(
        { pidx },
        { status },
        { returnDocument: "after" },
      );

      if (!updatedOrder) {
        throw new Error("Order not found");
      }

      return JSON.parse(JSON.stringify(updatedOrder)) as OrderType;
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error updating order status:", error.message);
      } else {
        console.error("Unknown error updating order status");
      }

      return null;
    }
  });

export const getUserOrdersFn = createServerFn({
  method: "GET",
})
  .inputValidator((data: { userId: string }) => z.object({ userId: z.string() }).parse(data))
  .handler(async ({ data }) => {
    try {
      await connectDb();

      const { userId } = data;

      const userOrders = await Order.find({ userId })
        .populate({
          path: "event",
          select: "title",
          populate: { path: "organizer", select: "clerkId firstName lastName" },
        })
        .populate({ path: "buyer", select: "clerkId firstName lastName" });

      return JSON.parse(JSON.stringify(userOrders)) as OrderResponse[];
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error fetching user orders:", error.message);
      } else {
        console.error("Unknown error fetching user orders");
      }

      return [];
    }
  });
