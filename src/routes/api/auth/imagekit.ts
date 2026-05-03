import ImageKit from "@imagekit/nodejs";
import { createFileRoute } from "@tanstack/react-router";

const IMAGEKIT_PUBLIC_KEY = Bun.env.IMAGEKIT_PUBLIC_KEY;
const IMAGEKIT_PRIVATE_KEY = Bun.env.IMAGEKIT_PRIVATE_KEY;

export const Route = createFileRoute("/api/auth/imagekit")({
  server: {
    handlers: {
      GET: async () => {
        try {
          if (!IMAGEKIT_PUBLIC_KEY || !IMAGEKIT_PRIVATE_KEY) {
            return new Response(JSON.stringify({ error: "ImageKit keys are not configured" }), {
              status: 500,
              headers: { "Content-Type": "application/json" },
            });
          }

          const imagekitClient = new ImageKit({
            privateKey: IMAGEKIT_PRIVATE_KEY,
          });

          const { expire, signature, token } = imagekitClient.helper.getAuthenticationParameters();

          return new Response(
            JSON.stringify({ publicKey: IMAGEKIT_PUBLIC_KEY, expire, signature, token }),
            {
              status: 200,
              headers: { "Content-Type": "application/json" },
            },
          );
        } catch (error) {
          if (error instanceof Error) {
            console.error("Error generating ImageKit authentication parameters:", error.message);
          } else {
            console.error("Unknown error generating ImageKit authentication parameters:", error);
          }

          return new Response(
            JSON.stringify({ error: "Failed to generate ImageKit authentication parameters" }),
            {
              status: 500,
              headers: { "Content-Type": "application/json" },
            },
          );
        }
      },
    },
  },
});
