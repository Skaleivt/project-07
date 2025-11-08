import { categoriesCollection } from '../db/models/categories.js';

export const parseFilterCategoryParams = async (query) => {
  const { category } = query;
  if (!category) return {};

  const foundCategory = await categoriesCollection.findOne({ name: category });
  return foundCategory ? { category: foundCategory._id } : {};
};
