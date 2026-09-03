import cors from 'cors';
import express from 'express';
import { env } from './config/env.js';
import { prisma } from './lib/prisma.js';
import { errorHandler } from './middleware/error-handler.js';
import { healthRouter } from './routes/health.js';
import { animalsRouter } from './routes/animals.routes.js';
import { speciesRouter } from './routes/species.routes.js';
import { enclosuresRouter } from './routes/enclosures.routes.js';


const app = express();

app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json());
app.use('/health', healthRouter);
app.use('/animals', animalsRouter);
app.use('/species', speciesRouter);
app.use('/enclosures', enclosuresRouter);
app.use(errorHandler);

async function start(): Promise<void> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    app.listen(env.PORT, () => {
      console.log(`Habitat API listening on http://localhost:${env.PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to PostgreSQL.', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

void start();
