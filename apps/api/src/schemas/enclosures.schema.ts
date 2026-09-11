import { z } from 'zod';

export const enclosureIdParams = z.object({
  id: z.coerce.number().int().positive(),
});

