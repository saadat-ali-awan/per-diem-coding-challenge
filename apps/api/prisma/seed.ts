import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  await prisma.store.upsert({
    where: { subDomain: 'a' },
    update: {},
    create: {
      subDomain: 'a',
      name: 'Store A',
      welcome: 'Welcome to Store A!',
      theme: {
        primary: '#1f6feb',
        background: '#0d1117',
        fontFamily: 'Inter, system-ui',
      },
    },
  });

  await prisma.store.upsert({
    where: { subDomain: 'b' },
    update: {},
    create: {
      subDomain: 'b',
      name: 'Store B',
      welcome: 'The freshest goods in town.',
      theme: {
        primary: '#10b981',
        background: '#ffffff',
        fontFamily: 'Rubik, system-ui',
      },
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('ERROR FOUND', e);
    await prisma.$disconnect();
    process.exit(1);
  });

void main().finally(() => void prisma.$disconnect());
