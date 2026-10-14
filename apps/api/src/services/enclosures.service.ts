import { prisma } from '../lib/prisma.js';
import type { Prisma } from '@prisma/client';
import type { CreateEnclosureInput } from '@habitat/shared';

export async function createEnclosure(
  input: CreateEnclosureInput,
  createdById: number,
) {
  return await prisma.enclosure.create({
    data: { ...input, createdById },
  });
}

export async function getEnclosures() {
  return await prisma.enclosure.findMany({
    orderBy: {
      name: 'asc',
    },
  });
}

export async function getEnclosureById(id: number) {
  return await prisma.enclosure.findUnique({
    where: {
      id,
    },
  });
}

export async function updateEnclosure(id: number, data: Prisma.EnclosureUpdateInput) {
  return await prisma.enclosure.update({
    where: {
      id,
    },
    data,
  });
}