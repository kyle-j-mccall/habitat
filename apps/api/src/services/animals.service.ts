import { prisma } from '../lib/prisma.js';
import type { CreateAnimalInput } from '../schemas/animals.schemas.js';

export async function createAnimal(input: CreateAnimalInput) {
  return prisma.animal.create({
    data: {
      name: input.name,
      species:   { connect: { id: input.speciesId } },
      enclosure: { connect: { id: input.enclosureId } },
    },
  });
}

export async function getAnimals() {
  return prisma.animal.findMany({
    orderBy: { name: 'asc' },
  });
}

export async function getAnimalById(id: number) {
  return prisma.animal.findUnique({
    where: { id },
  });
}

export async function updateAnimal(id: number, input: CreateAnimalInput) {
  return prisma.animal.update({
    where: { id },
    data: {
      name: input.name,
      species:   { connect: { id: input.speciesId } },
      enclosure: { connect: { id: input.enclosureId } },
    },
  });
}

export async function deleteAnimal(id: number) {
  return prisma.animal.delete({
    where: { id },
  });
} 
