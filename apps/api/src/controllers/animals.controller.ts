import type { Request, Response, NextFunction } from 'express';
import type { z } from 'zod';
import * as AnimalsService from '../services/animals.service.js';
import { animalIdParams } from '../schemas/animals.schemas.js';
import { createAnimalBody } from '@habitat/shared';

export async function getAllAnimals(_req: Request, res: Response, next: NextFunction) {
  try {
    const animals = await AnimalsService.getAnimals();
    res.json(animals);
  } catch (error) {
    next(error);
  }
}

export async function getAnimal(
  req: Request<z.infer<typeof animalIdParams>>,
  res: Response,
  next: NextFunction,
) {
  try {
    const animal = await AnimalsService.getAnimalById(req.params.id);
    if (!animal) {
      return res.status(404).json({ message: 'Animal not found' });
    }
    res.json(animal);
  } catch (error) {
    next(error);
  }
}

// Request generics are positional: <Params, ResBody, ReqBody>.
// No URL params on POST /animals, so we say "no keys" with Record<string, never>.
export async function postAnimal(
  req: Request<Record<string, never>, unknown, z.infer<typeof createAnimalBody>>,
  res: Response,
  next: NextFunction,
) {
  try {
    const animal = await AnimalsService.createAnimal(req.body);
    res.status(201).json(animal);
  } catch (error) {
    next(error);
  }
}

export async function updateAnimal(
  req: Request<z.infer<typeof animalIdParams>, unknown, z.infer<typeof createAnimalBody>>,
  res: Response,
  next: NextFunction,
) {
  try {
    const animal = await AnimalsService.updateAnimal(req.params.id, req.body);
    res.json(animal);
  } catch (error) {
    next(error);
  }
}

export async function deleteAnimal(
  req: Request<z.infer<typeof animalIdParams>>,
  res: Response,
  next: NextFunction,
) {
  try {
    await AnimalsService.deleteAnimal(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
