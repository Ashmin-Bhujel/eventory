import { connectDb } from "#/lib/database/db";
import { Category } from "#/lib/database/models/category.model";

export async function getCategoriesService() {
  await connectDb();

  return await Category.find().lean();
}

export async function createCategoryService(name: string) {
  await connectDb();

  return (await Category.create({ name })).toObject();
}
