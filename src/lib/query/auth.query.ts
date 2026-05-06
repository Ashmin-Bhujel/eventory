import { authStateFn } from "#/server/functions/auth.function";
import { queryOptions } from "@tanstack/react-query";

export const authStateQueryOptions = queryOptions({
  queryKey: ["auth"],
  queryFn: authStateFn,
});
