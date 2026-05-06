import type { Category, CreateCategoryInput } from "#/lib/zod/category.schema";

import { createCategorySchema } from "#/lib/zod/category.schema";
import { createServerFn } from "@tanstack/react-start";
import { createCategoryService, getCategoriesService } from "../services/category.service";

export const getCategoriesFn = createServerFn({
  method: "GET",
}).handler(async () => {
  try {
    const categories = await getCategoriesService();

    return JSON.parse(JSON.stringify(categories)) as Category[];
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error fetching categories: ${error.message}`);
    } else {
      console.error("Unknown error fetching categories");
    }

    return [];
  }
});

export const createCategoryFn = createServerFn({
  method: "POST",
})
  .inputValidator((data: CreateCategoryInput) => createCategorySchema.parse(data))
  .handler(async ({ data }) => {
    try {
      const { name } = data;

      const createdCategory = await createCategoryService(name);

      return JSON.parse(JSON.stringify(createdCategory)) as Category;
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error creating category: ${error.message}`);
      } else {
        console.error("Unknown error creating category");
      }

      return null;
    }
  });
