import { prisma } from '../lib/prisma.js';

export async function getAllFoods() {
  return prisma.food.findMany({
    orderBy: {
      name: 'asc',
    },
  });
}

export async function getFoodById(id: number) {
  return prisma.food.findUnique({
    where: { id },
  });
}

export async function createFood(name: string) {
  return prisma.food.create({
    data: { name },
  });
}

export async function updateFood(id: number, name: string) {
  return prisma.food.update({
    where: { id },
    data: { name },
  });
}

export async function deleteFood(id: number) {
  return prisma.food.delete({
    where: { id },
  });
}
