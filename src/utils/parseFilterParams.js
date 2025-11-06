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
