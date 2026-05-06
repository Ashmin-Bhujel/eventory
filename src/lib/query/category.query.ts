import { getCategoriesFn } from "#/server/functions/category.function";
import { queryOptions } from "@tanstack/react-query";

export const getCategoriesQueryOptions = queryOptions({
  queryKey: ["get", "categories"],
  queryFn: getCategoriesFn,
});
