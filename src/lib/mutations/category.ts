import type { CreateCategoryInput } from "#/lib/validation/category";

import { createCategoryFn } from "#/server/functions/category";
import { mutationOptions } from "@tanstack/react-query";

export const createCategoryMutationOptions = mutationOptions({
  mutationKey: ["create", "category"],
  mutationFn: (data: CreateCategoryInput) => createCategoryFn({ data }),
});
