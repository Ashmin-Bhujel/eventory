import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const OPENWEATHER_API_KEY = Bun.env.OPENWEATHER_API_KEY;

export const getCoordinatesFn = createServerFn({
  method: "GET",
})
  .inputValidator((data: { location: string }) =>
    z
      .object({
        location: z.string(),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    try {
      if (!OPENWEATHER_API_KEY) {
        console.error("OpenWeather API key is not set in environment variables.");
        return null;
      }

      const location = data.location.trim();

      if (!location || location.toLowerCase().includes("online")) {
        return null;
      }

      const response = await fetch(
        `http://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
          location,
        )}&limit=1&appid=${OPENWEATHER_API_KEY}`,
      );

      if (!response.ok) {
        console.error("OpenWeather geocoding request failed:", response.status);
        return null;
      }

      const responseData: { lat: number; lon: number }[] = await response.json();

      if (responseData.length === 0) {
        return null;
      }

      return responseData[0];
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error fetching geocoding data:", error.message);
      } else {
        console.error("Unknown error fetching geocoding data:");
      }

      return null;
    }
  });
