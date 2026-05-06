import { getUserOrdersFn } from "#/server/functions/order.function";
import { queryOptions } from "@tanstack/react-query";

export const getUserOrdersQueryOptions = (userId: string) =>
  queryOptions({
    queryKey: ["get", "orders", "user", userId],
    queryFn: () => getUserOrdersFn({ data: { userId } }),
  });
