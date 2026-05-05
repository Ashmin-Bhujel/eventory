import type {
  InitiatePaymentData,
  InitiatePaymentResponse,
  VerifyPaymentResponse,
} from "#/lib/validation/payment";

import { connectDb } from "#/lib/database/db";
import { createOrderFn, updateOrderPidxFn } from "./order";

const KHALTI_API_URL = process.env.KHALTI_API_URL;
const KHALTI_LIVE_SECRET_KEY = process.env.KHALTI_LIVE_SECRET_KEY;
const KHALTI_RETURN_URL = process.env.KHALTI_RETURN_URL;
const KHALTI_WEBSITE_URL = process.env.KHALTI_WEBSITE_URL;
const KHALTI_PAYMENT_VERIFY_URL = process.env.KHALTI_PAYMENT_VERIFY_URL;

export async function initiatePaymentFn(data: InitiatePaymentData) {
  try {
    if (!KHALTI_API_URL || !KHALTI_LIVE_SECRET_KEY || !KHALTI_RETURN_URL || !KHALTI_WEBSITE_URL) {
      throw new Error("One or more required Khalti environment variables are not defined");
    }

    const calculatedAmount = data.product_details.reduce((sum, item) => sum + item.total_price, 0);

    if (calculatedAmount !== data.amount) {
      throw new Error("Amount mismatch with product details");
    }

    await connectDb();

    const createdOrder = await createOrderFn({
      data: {
        pidx: crypto.randomUUID(),
        totalAmount: calculatedAmount,
        status: data.amount === 0 ? "Completed" : "Pending",
        event: data.event,
        buyer: data.buyer,
      },
    });

    if (!createdOrder) {
      throw new Error("Failed to create order for payment");
    }

    if (data.amount === 0) {
      return {
        pidx: createdOrder.pidx,
        payment_url: "/events",
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        expires_in: 86400,
      };
    }

    const options = {
      method: "POST",
      url: `${KHALTI_API_URL}/epayment/initiate/`,
      headers: {
        Authorization: `key ${KHALTI_LIVE_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        return_url: KHALTI_RETURN_URL,
        website_url: KHALTI_WEBSITE_URL,
        amount: data.amount * 100,
        purchase_order_id: createdOrder._id,
        purchase_order_name: data.purchase_order_name + " Ticket",
        customer_info: {
          name: data.customer_info.name,
          email: data.customer_info.email,
          phone: data.customer_info.phone,
        },
        product_details: data.product_details.map((item) => ({
          identity: item.identity,
          name: item.name + " Ticket",
          total_price: item.total_price * 100,
          quantity: item.quantity,
          unit_price: item.unit_price * 100,
        })),
        merchant_username: data.merchant_username,
        merchant_extra: data.merchant_extra,
      }),
    };

    const response = await fetch(options.url, {
      method: options.method,
      headers: options.headers,
      body: options.body,
    });

    if (!response.ok) {
      let errorBody;

      try {
        errorBody = await response.json();
      } catch {
        errorBody = await response.text();
      }

      throw new Error(
        `Failed to initiate payment: ${response.status} ${response.statusText} - ${JSON.stringify(errorBody)}`,
      );
    }

    const result: InitiatePaymentResponse = await response.json();

    const updatedOrder = await updateOrderPidxFn({
      data: { pidx: result.pidx, orderId: createdOrder._id },
    });

    if (!updatedOrder) {
      throw new Error("Failed to update order with pidx");
    }

    return result;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error initiating payment:", error.message);
    } else {
      console.error("Unknown error initiating payment");
    }

    throw error;
  }
}

export async function verifyPaymentFn(pidx: string) {
  try {
    if (!KHALTI_PAYMENT_VERIFY_URL || !KHALTI_LIVE_SECRET_KEY) {
      throw new Error("One or more required Khalti environment variables are not defined");
    }

    const options = {
      method: "POST",
      url: KHALTI_PAYMENT_VERIFY_URL,
      headers: {
        Authorization: `key ${KHALTI_LIVE_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pidx }),
    };

    const response = await fetch(options.url, {
      method: options.method,
      headers: options.headers,
      body: options.body,
    });

    const result: VerifyPaymentResponse = await response.json();

    return result;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error verifying payment:", error.message);
    } else {
      console.error("Unknown error verifying payment");
    }

    throw error;
  }
}
