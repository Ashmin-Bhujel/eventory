import { z } from "zod";

export const initiatePaymentSchema = z.object({
  event: z.string("Please provide a valid event ID"),
  buyer: z.string("Please provide a valid buyer ID"),
  amount: z.number().min(0, "Amount cannot be negative"),
  purchase_order_name: z.string(),
  customer_info: z.object({
    name: z.string(),
    email: z.email(),
    phone: z.string(),
  }),
  product_details: z.array(
    z.object({
      identity: z.string(),
      name: z.string(),
      total_price: z.number().min(0, "Amount cannot be negative"),
      quantity: z.number().min(0, "Amount cannot be negative"),
      unit_price: z.number().min(0, "Amount cannot be negative"),
    }),
  ),
  merchant_username: z.string(),
  merchant_extra: z.string(),
});

export const initiatePaymentResponseSchema = z.object({
  pidx: z.string(),
  payment_url: z.url(),
  expires_at: z.string(),
  expires_in: z.number().min(0, "Amount cannot be negative"),
});

export const verifyPaymentResponseSchema = z.object({
  pidx: z.string(),
  total_amount: z.number().min(0, "Amount cannot be negative"),
  status: z.enum([
    "Completed",
    "Pending",
    "Expired",
    "Initiated",
    "Refunded",
    "User canceled",
    "Partially Refunded",
  ]),
  transaction_id: z.string().nullable(),
  fee: z.number().min(0, "Amount cannot be negative"),
  refunded: z.boolean(),
});

export type InitiatePaymentData = z.infer<typeof initiatePaymentSchema>;
export type InitiatePaymentResponse = z.infer<typeof initiatePaymentResponseSchema>;
export type VerifyPaymentResponse = z.infer<typeof verifyPaymentResponseSchema>;
