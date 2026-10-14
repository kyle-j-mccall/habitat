import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const species = [
  {
    commonName: 'Emerald Tree Skink',
    scientificName: 'Lamprolepis smaragdina',
  },
  { commonName: 'Leopard Gecko', scientificName: 'Eublepharis macularius' },
  { commonName: 'Bearded Dragon', scientificName: 'Pogona vitticeps' },
  { commonName: 'Crested Gecko', scientificName: 'Correlophus ciliatus' },
  { commonName: 'Ball Python', scientificName: 'Python regius' },
  { commonName: 'Corn Snake', scientificName: 'Pantherophis guttatus' },
  {
    commonName: 'California Kingsnake',
    scientificName: 'Lampropeltis californiae',
  },
];

const systemFoods = [
  // Insects
  'Crickets',
  'Dubia roaches',
  'Mealworms',
  'Superworms',
  'Waxworms',
  'Hornworms',
  // Rodents
  'Mice (pinky, frozen)',
  'Mice (fuzzy, frozen)',
  'Mice (adult, frozen)',
  'Rats (pup, frozen)',
  // Greens / vegetables
  'Collard greens',
  'Dandelion greens',
  'Kale',
  'Butternut squash',
  'Bell pepper',
  // Fruits (occasional)
  'Blueberries',
  'Mango',
  // Prepared Diets
  'Repashy Superfoods',
  'Mazuri Reptile Diet',
];

async function main() {
  const speciesResult = await prisma.species.createMany({
    data: species,
    skipDuplicates: true,
  });
  console.log(
    `Seeded ${speciesResult.count} new species (${species.length - speciesResult.count} already existed).`,
  );

  let createdFoodCount = 0;
  for (const name of systemFoods) {
    const existing = await prisma.food.findFirst({
      where: { name, createdById: null },
    });
    if (!existing) {
      await prisma.food.create({ data: { name } });
      createdFoodCount += 1;
    }
  }
  console.log(
    `Seeded ${createdFoodCount} new system foods (${systemFoods.length - createdFoodCount} already existed).`,
  );
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
