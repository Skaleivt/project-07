import express from 'express';
import {  createStoryController } from '../controllers/stories.js';
import { authorization } from '../middlewares/authenticate.js';
import { validateBody } from '../middlewares/validateBody.js';
import { createStoryValidationSchema, } from '../validation/stories.js';

const router = express.Router();

router.post('/', authorization, validateBody(createStoryValidationSchema), createStoryController);

export default router;