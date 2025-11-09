import { storiesCollection } from '../db/models/stories.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllStories = async ({ page, perPage, filter }) => {
  const skip = (page - 1) * perPage;

  const storiesQuery = storiesCollection.find();

  if (filter.category) {
    storiesQuery.where('category').equals(filter.category);
  }

  const [storiesCount, stories] = await Promise.all([
    storiesCollection.find().merge(storiesQuery).countDocuments(),
    storiesQuery.skip(skip).limit(perPage).exec(),
  ]);

  const paginationData = calculatePaginationData(storiesCount, page, perPage);

  return {
    data: stories,
    ...paginationData,
  };
};
