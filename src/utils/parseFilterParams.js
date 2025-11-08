import { categoriesCollection } from '../db/models/categories.js';

const parseType = (type) => {
  if (typeof type === 'string') {
    const isType = (type) => ['personal', 'home', 'work'].includes(type.trim());
    if (isType(type)) return type.trim();
  }
  return undefined;
};

const parseIsFavourite = (isFavourite) => {
  const isBoolean = typeof isFavourite === 'boolean';
  if (isBoolean) return;
  const isIsFavourite = (isFavourite) =>
    ['true', 'false'].includes(isFavourite);
  if (isIsFavourite(isFavourite)) return isFavourite;
};

export const parseFilterParams = (query) => {
  const { type, isFavourite } = query;
  const parsedType = parseType(type);
  const parsedIsFavourite = parseIsFavourite(isFavourite);

  return {
    type: parsedType,
    isFavourite: parsedIsFavourite,
  };
};

export const parseFilterCategoryParams = async (query) => {
  const { category } = query;
  if (!category) return {};
  const isValid = ['Європа', 'Азія', 'Пустелі', 'Африка'].includes(category);
  if (!isValid) return {};
  const foundCategory = await categoriesCollection.findOne({ name: category });
  if (!foundCategory) return {};
  return { category: foundCategory._id };
};
