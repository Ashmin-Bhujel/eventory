import { getUserByClerkIdFn } from "#/server/functions/user.function";
import { queryOptions } from "@tanstack/react-query";

export const getUserByClerkIdQueryOptions = (clerkId: string) =>
  queryOptions({
    queryKey: ["get", "user", clerkId],
    queryFn: () => getUserByClerkIdFn({ data: { clerkId } }),
  });
