import { Router } from 'express';
// import { authorization } from '../middlewares/authenticate.js';
import { getUserProfileController } from '../controllers/users.js';

const router = new Router();

router.get('/', getUserProfileController);

export const userRouter = router;
