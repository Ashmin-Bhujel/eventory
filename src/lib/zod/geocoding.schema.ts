import { z } from "zod";

export const geocodingSchema = z.object({
  location: z.string(),
});

export type GeocodingInput = z.infer<typeof geocodingSchema>;
