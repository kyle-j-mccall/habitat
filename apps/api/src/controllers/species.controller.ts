import type { Request, Response, NextFunction } from 'express';
import * as SpeciesService from '../services/species.service.js';

export async function getAllSpecies(_req: Request, res: Response, next: NextFunction) {
  try {
    const species = await SpeciesService.getAllSpecies();
    res.status(200).json(species);
  } catch (error) {
    next(error);
  }
}