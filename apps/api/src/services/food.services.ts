import { prisma } from '../lib/prisma.js';

// Food visibility model:
//   createdById IS NULL → system food, visible to everyone, uneditable by users
//   createdById = <id>  → custom food owned by that user, only they see/edit/delete it
//
// Reads use the "null OR mine" filter.
// Writes filter strictly by `createdById: userId`, which naturally excludes
// both other users' foods AND system foods (whose createdById is null).

export async function getAllFoods(userId: number) {
  return prisma.food.findMany({
    where: {
      OR: [{ createdById: null }, { createdById: userId }],
    },
    orderBy: { name: 'asc' },
  });
}

export async function getFoodById(id: number, userId: number) {
  return prisma.food.findFirst({
    where: {
      id,
      OR: [{ createdById: null }, { createdById: userId }],
    },
  });
}

export async function createFood(name: string, userId: number) {
  return prisma.food.create({
    data: { name, createdById: userId },
  });
}

export async function updateFood(id: number, name: string, userId: number) {
  const owned = await prisma.food.findFirst({
    where: { id, createdById: userId },
  });
  if (!owned) return null;
  return prisma.food.update({
    where: { id },
    data: { name },
  });
}

export async function deleteFood(id: number, userId: number) {
  const owned = await prisma.food.findFirst({
    where: { id, createdById: userId },
  });
  if (!owned) return null;
  return prisma.food.delete({ where: { id } });
}
