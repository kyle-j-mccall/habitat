import { z } from 'zod';

export const healthResponseSchema = z.object({
  status: z.literal('ok'),
});

export type HealthResponse = z.infer<typeof healthResponseSchema>;

export const speciesSchema = z.object({
  id: z.number(),
  commonName: z.string(),
});

export const speciesListSchema = z.array(speciesSchema);

export type Species = z.infer<typeof speciesSchema>;

export const createAnimalBody = z.object({
  name: z.string().min(1),
  speciesId: z.number().int().positive(),
  enclosureId: z.number().int().positive(),
});

export type CreateAnimalInput = z.infer<typeof createAnimalBody>;

export const animalSchema = z.object({
  id: z.number(),
  name: z.string(),
  speciesId: z.number().int().positive(),
  species: z.object({
    id: z.number(),
    commonName: z.string(),
  }),
  enclosureId: z.number().int().positive(),
  enclosure: z.object({
    id: z.number(),
    name: z.string(),
  }),
});

export const animalListSchema = z.array(animalSchema);

export type Animal = z.infer<typeof animalSchema>;



export const createEnclosureBody = z.object({
  name: z.string().min(1),
});

export type CreateEnclosureInput = z.infer<typeof createEnclosureBody>;

export const enclosureSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const enclosureListSchema = z.array(enclosureSchema);

export type Enclosure = z.infer<typeof enclosureSchema>;
