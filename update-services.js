const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

const db = new PrismaClient();

async function upsertService(data) {
  const existing = await db.service.findFirst({
    where: { slug: data.slug }
  });

  if (existing) {
    return db.service.update({
      where: { id: existing.id },
      data
    });
  }

  return db.service.create({
    data: {
      id: crypto.randomUUID(),
      ...data
    }
  });
}

async function main() {
  await db.service.updateMany({
    where: { name: 'Head & Scalp Massage' },
    data: { price: 400 }
  });

  await upsertService({
    name: 'Body Scrub',
    slug: 'body-scrub',
    category: 'Body Treatments',
    price: 800,
    duration: '60 min',
    durationMin: 60,
    description: 'Luxury exfoliating body treatment.',
    active: true,
    sortOrder: 12
  });

  await upsertService({
    name: 'Four Hands Massage',
    slug: 'four-hands-massage',
    category: 'Luxury Massage',
    price: 1200,
    duration: '60 min',
    durationMin: 60,
    description: 'Premium massage by two therapists simultaneously.',
    active: true,
    sortOrder: 13
  });

  const services = await db.service.findMany({
    orderBy: { sortOrder: 'asc' },
    select: {
      name: true,
      price: true
    }
  });

  console.table(services);
}

main()
  .catch(console.error)
  .finally(async () => {
    await db.$disconnect();
  });
