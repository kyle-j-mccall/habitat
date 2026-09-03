import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const species = [
  { commonName: 'Emerald Tree Skink', scientificName: 'Lamprolepis smaragdina' },
  { commonName: 'Leopard Gecko', scientificName: 'Eublepharis macularius' },
  { commonName: 'Bearded Dragon', scientificName: 'Pogona vitticeps' },
  { commonName: 'Crested Gecko', scientificName: 'Correlophus ciliatus' },
  { commonName: 'Ball Python', scientificName: 'Python regius' },
  { commonName: 'Corn Snake', scientificName: 'Pantherophis guttatus' },
  { commonName: 'California Kingsnake', scientificName: 'Lampropeltis californiae' },
];

async function main() {
  const result = await prisma.species.createMany({
    data: species,
    skipDuplicates: true,
  });
  console.log(`Seeded ${result.count} new species (${species.length - result.count} already existed).`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
