import { z } from 'zod';

export const animalIdParams = z.object({
  id: z.coerce.number().int().positive(),
});


