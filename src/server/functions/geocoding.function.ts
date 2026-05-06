import type { GeocodingInput } from "#/lib/zod/geocoding.schema";

import { geocodingSchema } from "#/lib/zod/geocoding.schema";
import { createServerFn } from "@tanstack/react-start";

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

export const getCoordinatesFn = createServerFn({
  method: "GET",
})
  .inputValidator((data: GeocodingInput) => geocodingSchema.parse(data))
  .handler(async ({ data }) => {
    try {
      if (!OPENWEATHER_API_KEY) {
        console.error("OpenWeather API key is not set in environment variables.");
      }

      const location = data.location.trim();

      if (!location || location.toLowerCase().includes("online")) {
        console.error("Invalid location.");
      }

      const response = await fetch(
        `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
          location,
        )}&limit=1&appid=${OPENWEATHER_API_KEY}`,
      );

      if (!response.ok) {
        console.error(
          `OpenWeather geocoding request failed: ${response.status} ${response.statusText}`,
        );
      }

      const responseData: { lat: number; lon: number }[] = await response.json();

      if (responseData.length === 0) {
        console.error("No geocoding data found.");
      }

      return responseData[0];
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error fetching geocoding data: ${error.message}`);
      } else {
        console.error("Unknown error fetching geocoding data");
      }
    }
  });
