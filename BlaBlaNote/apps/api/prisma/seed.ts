import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? 'admin@blablanote.dev';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? 'Admin12345!';

  const passwordHash = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      role: 'ADMIN',
      firstName: 'Admin',
      lastName: 'BlaBlaNote',
      password: passwordHash,
      isBlocked: false,
    },
    create: {
      email: adminEmail,
      role: 'ADMIN',
      firstName: 'Admin',
      lastName: 'BlaBlaNote',
      password: passwordHash,
      isBlocked: false,
    },
    select: { id: true, email: true, role: true },
  });

  console.log('Seeded admin:', admin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
