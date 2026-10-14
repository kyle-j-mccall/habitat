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
  enclosureId: z.number().int().positive().nullable(),
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
  enclosureId: z.number().int().positive().nullable(),
  enclosure: z
    .object({
      id: z.number(),
      name: z.string(),
    })
    .nullable(),
});

export const animalListSchema = z.array(animalSchema);

export type Animal = z.infer<typeof animalSchema>;

export const createEnclosureBody = z.object({
  name: z.string().min(1),
});

export type CreateEnclosureInput = z.infer<typeof createEnclosureBody>;

export const dbUserSchema = z.object({
  id: z.number(),
  firebaseId: z.string(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
  email: z.email(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type DbUser = z.infer<typeof dbUserSchema>;

export const enclosureSchema = z.object({
  id: z.number(),
  name: z.string(),
  animals: z.array(animalSchema),
});

export const enclosureListSchema = z.array(enclosureSchema);

export type Enclosure = z.infer<typeof enclosureSchema>;

export const foodSchema = z.object({
  id: z.number(),
  name: z.string(),
  createdById: z.number().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const foodListSchema = z.array(foodSchema);

export type Food = z.infer<typeof foodSchema>;

export const createFoodBody = z.object({
  name: z.string().min(1),
});

export type CreateFoodInput = z.infer<typeof createFoodBody>;

export const updateFoodBody = z.object({
  name: z.string().min(1),
});

export type UpdateFoodInput = z.infer<typeof updateFoodBody>;

export const addAnimalFoodBody = z.object({
  foodId: z.number().int().positive(),
});

export type AddAnimalFoodInput = z.infer<typeof addAnimalFoodBody>;

export const feedingEventSchema = z.object({
  id: z.number(),
  animalId: z.number().int().positive(),
  foodId: z.number().int().positive(),
  amount: z.number().positive(),
  notes: z.string().nullable(),
  fedAt: z.coerce.date(),
  createdById: z.number(),
  createdAt: z.coerce.date(),
  animal: animalSchema,
  food: foodSchema,
});

export const feedingEventListSchema = z.array(feedingEventSchema);

export type FeedingEvent = z.infer<typeof feedingEventSchema>;

export const createFeedingEventBody = z.object({
  foodId: z.number().int().positive(),
  amount: z.number().positive(),
  notes: z.string().min(1).optional(),
  fedAt: z.coerce.date().optional(),
});

export type CreateFeedingEventInput = z.infer<typeof createFeedingEventBody>;
