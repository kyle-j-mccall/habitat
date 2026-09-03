import { z } from 'zod';

export const animalIdParams = z.object({
  id: z.coerce.number().int().positive(),
});

export const createAnimalBody = z.object({
  name: z.string().min(1),
  speciesId: z.number().int().positive(),
  enclosureId: z.number().int().positive(),
});

export type CreateAnimalInput = z.infer<typeof createAnimalBody>;
