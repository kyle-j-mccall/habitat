import { requireAuth } from '../middleware/require-auth.js';
import { me } from '../controllers/user.controllers.js';
import { Router } from 'express';

const userRouter = Router();

userRouter.get('/me', requireAuth, me);

export default userRouter;
