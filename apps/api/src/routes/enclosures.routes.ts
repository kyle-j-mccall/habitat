import { Router } from 'express';
import { validateBody, validateParams } from '../middleware/validate.js';
import {
  getAllEnclosures,
  getEnclosure,
  postEnclosure,
} from '../controllers/enclosures.controller.js';
import { enclosureIdParams } from '../schemas/enclosures.schema.js';
import { createEnclosureBody } from '@habitat/shared';
export const enclosuresRouter = Router();

enclosuresRouter.get('/', getAllEnclosures);

enclosuresRouter.get('/:id', validateParams(enclosureIdParams), getEnclosure);

enclosuresRouter.post('/', validateBody(createEnclosureBody), postEnclosure);
