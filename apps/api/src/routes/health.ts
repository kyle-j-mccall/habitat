import { Router } from 'express';
import { healthResponseSchema } from '@habitat/shared';

export const healthRouter = Router();

healthRouter.get('/', (_request, response) => {
  response.json(healthResponseSchema.parse({ status: 'ok' }));
});
