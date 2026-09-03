import type { Request, Response, NextFunction } from 'express';
import type { z } from 'zod';
import * as EnclosuresService from '../services/enclosures.service.js';
import type { createEnclosureBody, enclosureIdParams } from '../schemas/enclosures.schema.js';

export async function getAllEnclosures(_req: Request, res: Response, next: NextFunction) {
  try {
    const enclosures = await EnclosuresService.getEnclosures();
    res.json(enclosures);
  } catch (error) {
    next(error);
}}

export async function getEnclosure(
  req: Request<z.infer<typeof enclosureIdParams>>,
  res: Response,
  next: NextFunction,
) {
  try {
    const enclosure = await EnclosuresService.getEnclosureById(req.params.id);
    if (!enclosure) {
      return res.status(404).json({ message: 'Enclosure not found' });
    }
    res.json(enclosure);
  } catch (error) {
    next(error);
  }
}

export async function postEnclosure(req: Request<Record<string, never>, unknown, z.infer<typeof createEnclosureBody>>, res: Response, next: NextFunction) {
  try {
    const enclosure = await EnclosuresService.createEnclosure(req.body);
    res.status(201).json(enclosure);
  } catch (error) {
    next(error);
  }
}