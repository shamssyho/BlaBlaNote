import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL as string;
  const password = process.env.ADMIN_PASSWORD as string;

  if (!email) throw new Error('Missing ADMIN_EMAIL');
  if (!password) throw new Error('Missing ADMIN_PASSWORD');

  const rounds = Number(process.env.BCRYPT_ROUNDS) || 10;
  const passwordHash = await bcrypt.hash(password, rounds);

  const user = await prisma.user.upsert({
    where: { email },
    update: {
      role: 'ADMIN',
      password: passwordHash,
    },
    create: {
      firstName: 'Admin',
      lastName: 'Root',
      email,
      password: passwordHash,
      role: 'ADMIN',
    },
  });

  console.log(`✅ Admin ready: ${user.email} (${user.role})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });