import mongoose from 'mongoose';
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
    .populate('ownerId')
    .populate('category');
  const storiesId = user.selectedStories;
  const limit = Number(perPage);
  const skip = (page - 1) * perPage;
  const total = storiesId.length;

  if (!storiesId) {
    throw createHttpError(404, 'User not found');
  }

  const paginatedIds = storiesId.slice(skip, skip + limit);

  const stories = await storiesCollection.find({
    _id: { $in: paginatedIds },
  });

  if (!stories) {
    throw createHttpError(404, 'User don`t have saved stories');
  }

  const paginationData = calculatePaginationData(
    total,
    Number(page),
    Number(perPage),
  );
  return { stories, ...paginationData };
};

export const updateStory = async (
  storyId,
  userId,
  img,
  payload,
  options = { new: true },
) => {
  const uploaded = await uploadToCloudinary(img.path);
  const avatarURL = uploaded.secure_url || uploaded.url;

  if (!avatarURL) {
    throw createHttpError(500, 'Failed to get avatar URL');
  }

  const story = await storiesCollection.findOneAndUpdate(
    { _id: storyId, ownerId: userId },
    { ...payload, img: avatarURL },
    options,
  );
  return story;
};

export const getStoryById = async (storyId) => {
  // Дыягнастычны лог — пакіньце часова
  console.log('Service Layer: Incoming ID:', storyId);

  // Пабудаваць умовы для $or — пакрывем і ObjectId, і string _id
  const orConditions = [];

  // Калі радок выглядае як валідны ObjectId — дадамо адпаведны аб'ект
  if (mongoose.isValidObjectId(storyId)) {
    try {
      orConditions.push({ _id: new mongoose.Types.ObjectId(storyId) });
    } catch (e) {
      // на ўсякі выпадак — ігнаруем памылку канвертацыі
      console.warn('Could not convert incoming id to ObjectId:', e);
    }
  }

  // Таксама дадаем праверку па радку (карысна калі _id ў БД захаваны як string)
  orConditions.push({ _id: storyId });

  // Калі няма ўмоў — вернем 404
  if (orConditions.length === 0) {
    throw createHttpError(400, 'Invalid story id');
  }

  // Шукайце адзін запіс які адпавядае хаця б адной умове
  const story = await storiesCollection
    .findOne({ $or: orConditions })
    .populate('ownerId', '_id name avatarUrl')
    .populate('category')
    .lean();

  console.log('Mongoose Result:', story);

  if (!story) {
    throw createHttpError(404, 'Story not found');
  }

  return story;
};
//src/services/stories.js
