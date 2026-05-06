import type { InitiatePaymentData, InitiatePaymentResponse } from "../zod/payment.schema";

import { mutationOptions } from "@tanstack/react-query";

export const initiatePaymentMutationOptions = mutationOptions({
  mutationKey: ["initiate", "payment"],
  mutationFn: async (initialPaymentData: InitiatePaymentData) => {
    const res = await fetch("/api/payment/initiate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(initialPaymentData),
    });

    if (!res.ok) {
      throw new Error("Failed to initiate payment");
    }

    return res.json() as Promise<InitiatePaymentResponse>;
  },
  onSuccess: (resposeData) => {
    window.location.href = resposeData.payment_url;
  },
  onError: (error) => {
    if (error instanceof Error) {
      console.error("Error initiating payment:", error.message);
    } else {
      console.error("Unknown error initiating payment");
    }
  },
});
