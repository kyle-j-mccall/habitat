/**
 * =============================================================================
 * animals.routes.ts — HTTP routing for /animals
 * =============================================================================
 *
 * This file's job is to:
 *   1. Define the URL shape of the /animals resource.
 *   2. Declare schemas for any URL params / bodies those routes accept.
 *   3. Wire middleware (validation, auth, etc.) in front of controllers.
 *
 * The controller stays "dumb" — by the time it runs, inputs are already
 * validated and coerced into real types.
 * ---------------------------------------------------------------------------
 */

import { Router } from 'express';
import { validateParams } from '../middleware/validate.js';
import { getAllAnimals, getAnimal, postAnimal } from '../controllers/animals.controller.js';
import { animalIdParams } from '../schemas/animals.schemas.js';

/**
 * SCHEMA: params for routes like /animals/:id
 *
 *   - `z.object({ ... })` describes the *shape* of an object.
 *   - `z.coerce.number()` first runs `Number(value)` on the incoming string,
 *     then treats the result as a number.
 *   - `.int()` rejects "3.14" or NaN.
 *   - `.positive()` rejects 0 and negatives (IDs start at 1).
 *
 * We `export` the schema so the controller can derive its TS type from it
 * via `z.infer<typeof animalIdParams>`. That's the "one source of truth"
 * bit: schema and type stay in lockstep automatically.
 */

export const animalsRouter = Router();

// GET /animals — list all animals. No params to validate.
animalsRouter.get('/', getAllAnimals);

// GET /animals/:id — fetch one animal.
//
// The middleware chain runs left-to-right:
//   1. validateParams(animalIdParams) validates & coerces req.params.id
//   2. If invalid → responds 400, controller never runs
//   3. If valid   → getAnimal runs with req.params.id ALREADY a number
animalsRouter.get('/:id', validateParams(animalIdParams), getAnimal);

animalsRouter.post('/', postAnimal);


