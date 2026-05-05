import type { Category as CategoryType, CreateCategoryInput } from "#/lib/validation/category";

import { connectDb } from "#/lib/database/db";
import { Category } from "#/lib/database/models/category.model";
import { createCategorySchema } from "#/lib/validation/category";
import { createServerFn } from "@tanstack/react-start";

export const getCategoriesFn = createServerFn({
  method: "GET",
}).handler(async () => {
  try {
    await connectDb();

    const categories = await Category.find();

    return JSON.parse(JSON.stringify(categories)) as CategoryType[];
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching categories:", error.message);
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

      await connectDb();

      const createdCategory = await Category.create({ name });

      return JSON.parse(JSON.stringify(createdCategory)) as CategoryType;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Error creating category: ${error.message}`);
      } else {
        throw new Error("Unknown error creating category");
      }
    }
  });
