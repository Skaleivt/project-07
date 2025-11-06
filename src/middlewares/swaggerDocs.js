import createHttpError from 'http-errors';
import * as fs from 'fs';
import path from 'path';
import swaggerUI from 'swagger-ui-express';

export const swaggerDocs = () => {
  try {
    const swaggerPath = path.join(process.cwd(), 'docs', 'swagger.json');

    const swaggerDoc = JSON.parse(fs.readFileSync(swaggerPath), 'utf-8');
    return [...swaggerUI.serve, swaggerUI.setup(swaggerDoc)];
  } catch {
    return (req, res, next) =>
      next(createHttpError(500, "Can't load swagger docs"));
  }
};
