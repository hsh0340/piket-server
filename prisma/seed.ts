import { PrismaClient } from '@prisma/client';
import { userSeed } from './functions/user.seed';
import { brandCategorySeed } from './functions/brand-category.seed';

const prisma = new PrismaClient();

async function seed() {
  await userSeed(prisma);
  await brandCategorySeed(prisma);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });
