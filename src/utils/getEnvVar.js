import createHttpError from 'http-errors';

export default function getEnvVar(key) {
  const value = process.env[key];
  if (!value) {
    throw createHttpError(500, `Error ${key}`);
  }

  return value;
}
