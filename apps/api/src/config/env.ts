import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number().int().positive().default(3000),
  CORS_ORIGIN: z.string().url().default('http://localhost:5173'),
  GOOGLE_APPLICATION_CREDENTIALS: z.string().min(1),
});

export const env = envSchema.parse(process.env);
