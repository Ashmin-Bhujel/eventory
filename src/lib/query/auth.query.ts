import { authStateFn } from "#/server/functions/auth.function";
import { queryOptions } from "@tanstack/react-query";

export const authStateQueryOptions = queryOptions({
  queryKey: ["auth"],
  queryFn: authStateFn,
  staleTime: 5 * 60 * 1000,
  retry: 1,
  retryDelay: 1000,
});
