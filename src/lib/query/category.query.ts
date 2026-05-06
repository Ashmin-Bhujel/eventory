import { getCategoriesFn } from "#/server/functions/category.function";
import { queryOptions } from "@tanstack/react-query";

export const getCategoriesQueryOptions = queryOptions({
  queryKey: ["get", "categories"],
  queryFn: getCategoriesFn,
  staleTime: 5 * 60 * 1000,
  retry: 1,
  retryDelay: 1000,
});
