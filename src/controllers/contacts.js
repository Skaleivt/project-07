import {
  createContacts,
  deleteContacts,
  getAllContacts,
  getAllContactsById,
  updateContacts,
} from '../services/contacts.js';
import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import getEvnVar from '../utils/getEnvVar.js';
import * as fs from 'node:fs/promises';
import path from 'node:path';
import { uploadToCloudinary } from '../middlewares/uploadToCloudinary.js';

export const getAllContactsController = async (req, res, next) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortOrder, sortBy } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);
  const userId = req.user._id;

  const contacts = await getAllContacts(
    page,
    perPage,
    sortOrder,
    sortBy,
    filter,
    userId,
  );

  if (!contacts.data.length) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).json({
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getAllContactsByIdController = async (req, res, next) => {
  const { contactId } = req.params;
  const userId = req.user._id;

  const contacts = await getAllContactsById(contactId, userId);
  if (!contacts) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).json({
    message: `Successfully found contact with id ${contactId}!`,
    data: contacts,
  });
};

const uploadPhoto = async (value) => {
  if (!value) return;
  let photo;

  if (getEvnVar('UPLOAD_CLOUDINARY') === 'true') {
    const response = await uploadToCloudinary(value.path);
    await fs.unlink(value.path);
    photo = response.secure_url;
  } else {
    await fs.rename(
      value.path,
      path.resolve('src/uploads/photo', value.filename),
    );
    photo = `${getEvnVar('APP_DOMAIN')}/photo/${value.filename}`;
  }

  return photo;
};

export const createContactsController = async (req, res, next) => {
  let photo = await uploadPhoto(req.file);

  const userId = req.user._id;
  const contact = await createContacts(
    {
      ...req.body,
      photo,
    },
    userId,
  );

  res.status(201).json({
    status: 201,
    message: `Successfully created a contact!`,
    data: contact,
  });
};

export const updateContactsController = async (req, res, next) => {
  let photo = await uploadPhoto(req.file);

  const { contactId } = req.params;
  const userId = req.user._id;
  const contact = await updateContacts(
    contactId,
    userId,
    { ...req.body, photo },
    {
      new: true,
    },
  );

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).json({
    message: `Successfully patched a contact!`,
    data: contact,
  });
};

export const deleteContactsController = async (req, res, next) => {
  const { contactId } = req.params;
  const userId = req.user._id;
  const contact = await deleteContacts(contactId, userId);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(200).json({
    message: `Successfully delete a contact!`,
  });
};
