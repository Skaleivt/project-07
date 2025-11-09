// src/routers/users.js
import { Router } from 'express';
import { getUserById, getAllUsers } from '../controllers/users.js';

const router = Router();

/**
 * GET /api/users
 * Отримати список усіх користувачів
 */
router.get('/', getAllUsers);

/**
 * GET /api/users/:id
 * Отримати одного користувача + його історії
 */
router.get('/:id', getUserById);

export default router;
import { authorization } from '../middlewares/authenticate.js';
import { getUserProfileController } from '../controllers/users.js';


router.get('/', authorization, getUserProfileController);

export const userRouter = router;
