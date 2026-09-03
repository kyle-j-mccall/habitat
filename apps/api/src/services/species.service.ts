import { prisma } from '../lib/prisma.js';

export async function getAllSpecies() {
  return await prisma.species.findMany({
    orderBy: {
      commonName: 'asc',
    },
  });
}

