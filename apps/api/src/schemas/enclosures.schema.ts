import { z } from 'zod';

export const enclosureIdParams = z.object({
  id: z.coerce.number().int().positive(),
});

export const createEnclosureBody = z.object({
  name: z.string().min(1),
});