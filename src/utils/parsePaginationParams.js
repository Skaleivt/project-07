const parseNumber = (number, defaultNumber) => {
  if (typeof number === 'number') {
    return number;
  }
  if (!number) {
    return defaultNumber;
  }
  const parsedNumber = parseInt(number, 10);
  if (Number.isNaN(parsedNumber)) {
    return defaultNumber;
  }

  return parsedNumber;
};

export const parsePaginationParams = (query) => {
  const { page, perPage } = query;
  const parsedPage = parseNumber(page, 1);
  const parsedPerPage = parseNumber(perPage, 9);
  return {
    page: parsedPage,
    perPage: parsedPerPage,
  };
};
