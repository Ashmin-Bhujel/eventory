import type { CreateCategoryInput } from "#/lib/zod/category.schema";

import { createCategoryFn } from "#/server/functions/category.function";
import { mutationOptions } from "@tanstack/react-query";

export const createCategoryMutationOptions = mutationOptions({
  mutationKey: ["create", "category"],
  mutationFn: (data: CreateCategoryInput) => createCategoryFn({ data }),
});
