import { auth } from "@clerk/tanstack-react-start/server";
import { createServerFn } from "@tanstack/react-start";

export const authStateFn = createServerFn({
  method: "GET",
}).handler(async () => {
  const { isAuthenticated, userId } = await auth();

  return {
    isAuthenticated,
    userId,
  };
});
