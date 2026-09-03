import { Router } from 'express';
import { validateParams } from '../middleware/validate.js';
import { getAllEnclosures, getEnclosure, postEnclosure } from '../controllers/enclosures.controller.js';
import { enclosureIdParams } from '../schemas/enclosures.schema.js';
export const enclosuresRouter = Router();

enclosuresRouter.get('/', getAllEnclosures);

enclosuresRouter.get('/:id', validateParams(enclosureIdParams), getEnclosure);

enclosuresRouter.post('/', postEnclosure);