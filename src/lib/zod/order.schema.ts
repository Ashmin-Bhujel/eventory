import { z } from "zod";

export const orderSchema = z.object({
  _id: z.string(),
  pidx: z.string(),
  totalAmount: z.number(),
  event: z.string(),
  buyer: z.string(),
  status: z.enum([
    "Completed",
    "Pending",
    "Expired",
    "Initiated",
    "Refunded",
    "User canceled",
    "Partially Refunded",
  ]),
});

export const createOrderSchema = z.object({
  pidx: z.string("Please provide a valid payment ID"),
  totalAmount: z.number("Please provide a valid price").min(0, "Price cannot be negative"),
  event: z.string("Please provide a valid event ID"),
  buyer: z.string("Please provide a valid buyer ID"),
  status: z
    .enum([
      "Completed",
      "Pending",
      "Expired",
      "Initiated",
      "Refunded",
      "User canceled",
      "Partially Refunded",
    ])
    .default("Pending"),
});

export const orderResponseSchema = z.object({
  _id: z.string(),
  pidx: z.string(),
  totalAmount: z.number(),
  event: z.object({
    _id: z.string(),
    title: z.string(),
    organizer: z.object({
      _id: z.string(),
      clerkId: z.string(),
      firstName: z.string(),
      lastName: z.string(),
    }),
  }),
  buyer: z.object({
    _id: z.string(),
    clerkId: z.string(),
    firstName: z.string(),
    lastName: z.string(),
  }),
  status: z.enum([
    "Completed",
    "Pending",
    "Expired",
    "Initiated",
    "Refunded",
    "User canceled",
    "Partially Refunded",
  ]),
});

export const updateOrderPidxSchema = z.object({ orderId: z.string(), pidx: z.string() });

export const updateOrderStatusSchema = z.object({
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
});

export const getUserOrdersSchema = z.object({ userId: z.string() });

export type Order = z.infer<typeof orderSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type OrderResponse = z.infer<typeof orderResponseSchema>;
export type UpdateOrderPidxInput = z.infer<typeof updateOrderPidxSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type GetUserOrdersInput = z.infer<typeof getUserOrdersSchema>;
