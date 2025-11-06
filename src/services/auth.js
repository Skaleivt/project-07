import createHttpError from 'http-errors';
import { UsersCollection } from '../db/models/user.js';
import bcrypt from 'bcrypt';
import { SessionCollection } from '../db/models/session.js';
import { randomBytes } from 'crypto';
import { FIFTEEN_MINUTES, ONE_DAY } from '../constants/index.js';
import jwt from 'jsonwebtoken';
import getEnvVar from '../utils/getEnvVar.js';
import { sendMail } from '../utils/sendMail.js';
import path from 'node:path';
import * as fs from 'node:fs';
import Handlebars from 'handlebars';

export const registerUser = async (payload) => {
  const isUser = await UsersCollection.findOne({ email: payload.email });
  if (isUser) {
    throw createHttpError(409, 'Email in use');
  }
  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  return await UsersCollection.create({
    ...payload,
    password: encryptedPassword,
  });
};

const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + ONE_DAY),
  };
};

export const loginUser = async (payload) => {
  const user = await UsersCollection.findOne({
    email: payload.email,
  });
  if (!user) {
    throw createHttpError(401, 'User not found');
  }
  const isEqual = await bcrypt.compare(payload.password, user.password);
  if (!isEqual) {
    throw createHttpError(401, 'Unauthorized');
  }

  await SessionCollection.deleteOne({ userId: user._id });

  const newSession = createSession();
  return SessionCollection.create({
    userId: user._id,
    ...newSession,
  });
};

export const logoutUser = async (sessionId) => {
  await SessionCollection.deleteOne({ _id: sessionId });
};

export const refreshSession = async ({ sessionId, refreshToken }) => {
  const session = await SessionCollection.findById(sessionId);

  if (!session) {
    throw new createHttpError(401, 'Session not found');
  }

  if (session.refreshToken !== refreshToken) {
    throw new createHttpError(401, 'Refresh token is invalid');
  }

  if (new Date() > new Date(session.refreshTokenValidUntil)) {
    throw new createHttpError(401, 'Session token expired');
  }

  await SessionCollection.deleteOne({ _id: session._id });

  const newSession = createSession();

  return SessionCollection.create({
    userId: session.userId,
    ...newSession,
  });
};

export const requestResetToken = async (email) => {
  const user = await UsersCollection.findOne({ email });

  if (!user) {
    throw createHttpError(401, 'User not found');
  }

  const REQUEST_PASSWORD_TEMPLATE = fs.readFileSync(
    path.resolve('src/template/request-password-reset.html'),
    'utf-8',
  );

  const template = Handlebars.compile(REQUEST_PASSWORD_TEMPLATE);

  const token = jwt.sign(
    {
      sub: user._id,
      email,
    },
    getEnvVar('JWT_SECRET'),
    {
      expiresIn: '15m',
    },
  );

  await sendMail({
    from: getEnvVar('SMTP_FROM'),
    to: email,
    subject: 'Reset your password',
    html: template({
      name: user.name,
      link: `${getEnvVar('APP_DOMAIN')}/reset-password?token=${token}`,
    }),
  });
};

export const resetPassword = async (payload) => {
  let decoded;
  try {
    decoded = jwt.verify(payload.token, getEnvVar('JWT_SECRET'));
  } catch (err) {
    if (err instanceof Error) {
      throw createHttpError(401, 'Token is expired or invalid.');
    }
  }
  const hashedPassword = await bcrypt.hash(payload.password, 10);

  const user = await UsersCollection.findByIdAndUpdate(decoded.sub, {
    password: hashedPassword,
  });

  if (!user) {
    throw createHttpError(401, 'User not found');
  }
};
