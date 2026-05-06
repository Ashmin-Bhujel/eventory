import type {
  CreateOrderInput,
  GetUserOrdersInput,
  UpdateOrderPidxInput,
  UpdateOrderStatusInput,
} from "#/lib/zod/order.schema";

import { connectDb } from "#/lib/database/db";
import { Order } from "#/lib/database/models/order.model";

export async function createOrderService(createOrderData: CreateOrderInput) {
  await connectDb();

  return (await Order.create(createOrderData)).toObject();
}

export async function updateOrderPidxService(updateOrderPidxData: UpdateOrderPidxInput) {
  await connectDb();

  return await Order.findByIdAndUpdate(
    updateOrderPidxData.orderId,
    { pidx: updateOrderPidxData.pidx },
    { returnDocument: "after" },
  ).lean();
}

export async function updateOrderStatusService(updateOrderStatusData: UpdateOrderStatusInput) {
  await connectDb();

  const { pidx, status } = updateOrderStatusData;

  return await Order.findOneAndUpdate({ pidx }, { status }, { returnDocument: "after" }).lean();
}

export async function getUserOrdersService(userId: GetUserOrdersInput["userId"]) {
  await connectDb();

  return await Order.find({ userId })
    .populate({
      path: "event",
      select: "title",
      populate: { path: "organizer", select: "clerkId firstName lastName" },
    })
    .populate({ path: "buyer", select: "clerkId firstName lastName" })
    .lean();
}
