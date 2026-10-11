import { z } from 'zod';

export const tokenClaimsSchema = z.object({
  email: z.string().email(),
  uid: z.string(),
});
