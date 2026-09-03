import { Router } from 'express';
import { getAllSpecies } from '../controllers/species.controller.js';

const speciesRouter = Router();

speciesRouter.get('/', getAllSpecies);

export { speciesRouter };