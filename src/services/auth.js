import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { UsersCollection } from '../db/models/users.js';

export const userRegisterService = async (body) => {
  const user = await UsersCollection.findOne({ email: body.email });

  if (user) {
    throw createHttpError(409, 'Email in use');
  }

  const hashPassword = await bcrypt.hash(body.password, 10);

  return await UsersCollection.create({ ...body, password: hashPassword });
};
