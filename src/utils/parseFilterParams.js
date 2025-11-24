// utils/parseFilterParams.js

import { categoriesCollection } from '../db/models/categories.js';
import { ObjectId } from 'mongodb';

export const parseFilterCategoryParams = async (query) => {
  const { category } = query;
  if (!category) return {};

  const foundCategory = await categoriesCollection.findOne({ _id: category });
  return foundCategory ? { category: foundCategory._id } : {};
};

export const parseFilterOwnerParams = (query) => {
  const { ownerId } = query;
  if (!ownerId) return {};

  try {
    return { ownerId: new ObjectId(ownerId) };
  } catch (_) {
    return {};
  }
};

export const parseFilterParams = async (query) => {
  const categoryFilter = await parseFilterCategoryParams(query);
  if (Object.keys(categoryFilter).length > 0) {
    return categoryFilter;
  }

  const ownerFilter = parseFilterOwnerParams(query);
  if (Object.keys(ownerFilter).length > 0) {
    return ownerFilter;
  }

  return {};
};
