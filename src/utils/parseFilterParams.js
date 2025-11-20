// utils/parseFilterParams.js

import { categoriesCollection } from '../db/models/categories.js';
import { ObjectId } from 'mongodb';
export const parseFilterCategoryParams = async (query) => {
  const { category } = query;
  if (!category) return {};

  const foundCategory = await categoriesCollection.findOne({ _id: category });
  return foundCategory ? { category: foundCategory._id } : {};
};

// Функцыя для апрацоўкі агульнага параметра 'filter' (для travellerId)
export const parseFilterOwnerParams = (query) => {
  const { filter } = query;
  if (!filter) return {};

  try {
    return { ownerId: new ObjectId(filter) };
  } catch (_) {
    return {};
  }
};

// Прыклад асноўнай функцыі, якая будзе выклікаць іншыя (вам трэба праверыць, як яна ў вас імпартуецца)
export const parseFilterParams = async (query) => {
  // Апрацоўка фільтра па катэгорыі
  const categoryFilter = await parseFilterCategoryParams(query);
  if (Object.keys(categoryFilter).length > 0) {
    return categoryFilter;
  }

  // Апрацоўка фільтра па ўладальніку (падарожніку)
  const ownerFilter = parseFilterOwnerParams(query);
  if (Object.keys(ownerFilter).length > 0) {
    return ownerFilter;
  }

  return {};
};
