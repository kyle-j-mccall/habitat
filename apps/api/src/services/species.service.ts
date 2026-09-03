import { prisma } from '../lib/prisma.js';

export async function getSpecies() {
  return await prisma.species.findMany({
    orderBy: {
      commonName: 'asc',
    },
  });
}

