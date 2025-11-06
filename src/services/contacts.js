import { ContactCollection } from '../db/models/contacts.js';
import { calculatePaginationData } from '../utils/calculatePaginationData.js';

export const getAllContacts = async (
  page = 1,
  perPage = 10,
  sortOrder,
  sortBy,
  filter = {},
  userId,
) => {
  const limit = perPage;
  const skip = (page - 1) * perPage;

  const contactsQuery = ContactCollection.find({ userId });
  if (filter.type) {
    contactsQuery.where('contactType').equals(filter.type);
  }
  if (filter.isFavourite) {
    contactsQuery.where('isFavourite').equals(filter.isFavourite);
  }

  const contactsCount = await ContactCollection.find()
    .merge(contactsQuery)
    .countDocuments();

  const contacts = await contactsQuery
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder })
    .exec();
  const pagination = calculatePaginationData(contactsCount, page, perPage);
  return {
    data: contacts,
    ...pagination,
  };
};

export const getAllContactsById = async (contactId, userId) => {
  const contact = await ContactCollection.findOne({ _id: contactId, userId });
  return contact;
};

export const createContacts = async (payload, userId) => {
  const contact = await ContactCollection.create({ ...payload, userId });
  return contact;
};

export const updateContacts = async (
  contactId,
  userId,
  payload,
  options = { new: true },
) => {
  const contact = await ContactCollection.findOneAndUpdate(
    { _id: contactId, userId },
    payload,
    options,
  );
  return contact;
};

export const deleteContacts = async (contactId, userId) => {
  const contact = await ContactCollection.findOneAndDelete({
    _id: contactId,
    userId,
  });
  return contact;
};
