import { calculatePaginationData } from '../utils/calculatePaginationData.js';
import { storiesCollection } from '../db/models/stories.js';
import uploadToCloudinary from '../utils/uploadToCloudinary.js';
import createHttpError from 'http-errors';
import { UsersCollection } from '../db/models/users.js';
import { categoriesCollection } from '../db/models/categories.js';

export const getAllStories = async ({
  page,
  perPage,
  filter,
  sortField,
  sortOrder,
}) => {
  const skip = (page - 1) * perPage;

  const query = {};

  if (filter?.category) {
    query.category = filter.category;
  }
  if (filter?.ownerId) {
    query.ownerId = filter.ownerId;
  }
  const storiesCount = await storiesCollection.countDocuments(query);

  const sort = {};
  if (sortField) {
    sort[sortField] = sortOrder === 'desc' ? -1 : 1;
  }

  const stories = await storiesCollection
    .find(query)
    .sort(sort)
    .populate('ownerId')
    .populate('category')
    .skip(skip)
    .limit(perPage);
  const paginationData = calculatePaginationData(storiesCount, page, perPage);

  return {
    data: stories,
    ...paginationData,
  };
};

export const createStory = async (img, title, article, category, userId) => {
  const uploaded = await uploadToCloudinary(img.path);
  const avatarURL = uploaded.secure_url || uploaded.url;

  if (!avatarURL) {
    throw createHttpError(500, 'Failed to get avatar URL');
  }

  const story = await storiesCollection.create({
    img: avatarURL,
    title,
    article,
    category,
    ownerId: userId,
    date: new Date(Date.now()),
  });
  if (!story) {
    throw createHttpError(400, 'Failed to get story');
  }

  return story;
};

export const getSavedStories = async (userId, page = 1, perPage = 10) => {
  const user = await UsersCollection.findById(userId)
    .select('selectedStories')
    .lean();

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const storiesId = user.selectedStories;
  const total = storiesId.length;

  const skip = (page - 1) * perPage;
  const limit = perPage;

  const paginatedIds = storiesId.slice(skip, skip + limit);

  const stories = await storiesCollection
    .find({ _id: { $in: paginatedIds } })
    .populate('ownerId', '_id name avatarUrl')
    .populate('category')
    .lean();
  const paginationData = calculatePaginationData(total, page, perPage);

  return {
    data: { stories: stories },
    ...paginationData,
  };
};

export const updateStory = async (
  storyId,
  userId,
  img,
  payload,
  options = { new: true },
) => {
  let finalPayload = { ...payload };

  if (img) {
    const uploaded = await uploadToCloudinary(img.path);
    const avatarURL = uploaded.secure_url || uploaded.url;

    if (!avatarURL) {
      throw createHttpError(500, 'Failed to get image URL');
    }
    finalPayload.img = avatarURL;
  }

  const story = await storiesCollection.findOneAndUpdate(
    { _id: storyId, ownerId: userId },
    finalPayload,
    options,
  );
  return story;
};

export const getStoryById = async (storyId) => {
  const story = await storiesCollection
    .findOne({ _id: storyId })
    .populate('ownerId', '_id name avatarUrl')
    .populate('category')
    .lean();

  if (!story) {
    throw createHttpError(404, 'Story not found');
  }

  if (story.ownerId) {
    story.owner = story.ownerId;
    delete story.ownerId;
  }

  return story;
};

export const getCategories = async () => {
  const categories = await categoriesCollection.find();
  return categories;
};
