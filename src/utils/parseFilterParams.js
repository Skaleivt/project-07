import { categoriesCollection } from '../db/models/categories.js';

export const parseFilterCategoryParams = async (query) => {
  const { category, ownerId, filter } = query; // Додаємо 'filter'
  const finalFilter = {};

  // Якщо надано нестандартний параметр 'filter', припускаємо, що це ID власника
  if (filter) {
    finalFilter.ownerId = filter; // Або category, залежно від вашої логіки
    return finalFilter;
  }

  // Якщо надано стандартні параметри, використовуємо стару логіку (з виправленням)
  if (category) {
    const foundCategory = await categoriesCollection.findOne({
      name: category,
    });
    if (foundCategory) {
      finalFilter.category = foundCategory._id;
    }
  }

  if (ownerId) {
    finalFilter.ownerId = ownerId;
  }

  return finalFilter;
};
