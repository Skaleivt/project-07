// src/routers/users.js

import { Router } from 'express';
import { authorization } from '../middlewares/authenticate.js';

import {
  getUserProfileController,
  addStoryToSavedController,
} from '../controllers/users.js';

const router = new Router();

router.get('/', authorization, getUserProfileController);

router.post('/saved', authorization, addStoryToSavedController);

export const userRouter = router;
