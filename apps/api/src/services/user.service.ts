import { prisma } from '../lib/prisma.js';

type UpsertUserInput = {
  firebaseId: string;
  firstName?: string;
  lastName?: string;
  email: string;
};

export async function upsertUser(input: UpsertUserInput) {
  await prisma.dbUser.upsert({
    where: { firebaseId: input.firebaseId },
    create: input,
    update: { email: input.email },
  });
}
