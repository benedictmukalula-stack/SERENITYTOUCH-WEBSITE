const { PrismaClient } = require('@prisma/client');
const crypto = require('crypto');

const prisma = new PrismaClient();

const services = [
  {
    name: 'Head & Scalp Massage',
    slug: 'head-scalp-massage',
    category: 'Massage',
    price: 400,
    duration: '30 min',
    durationMin: 30,
    sortOrder: 1,
    description: 'Relaxing scalp and head massage.',
    active: true,
  },
  {
    name: 'Foot Massage',
    slug: 'foot-massage',
    category: 'Massage',
    price: 500,
    duration: '45 min',
    durationMin: 45,
    sortOrder: 2,
    description: 'Therapeutic foot massage.',
    active: true,
  },
  {
    name: 'Back, Neck & Shoulder',
    slug: 'back-neck-shoulder',
    category: 'Massage',
    price: 600,
    duration: '45 min',
    durationMin: 45,
    sortOrder: 3,
    description: 'Upper body tension relief.',
    active: true,
  },
  {
    name: 'Swedish Massage',
    slug: 'swedish-massage',
    category: 'Massage',
    price: 800,
    duration: '60 min',
    durationMin: 60,
    sortOrder: 4,
    description: 'Classic Swedish massage.',
    active: true,
  },
  {
    name: 'Reflexology',
    slug: 'reflexology',
    category: 'Massage',
    price: 850,
    duration: '60 min',
    durationMin: 60,
    sortOrder: 5,
    description: 'Pressure-point therapy.',
    active: true,
  },
  {
    name: 'Aromatherapy Massage',
    slug: 'aromatherapy-massage',
    category: 'Massage',
    price: 900,
    duration: '60 min',
    durationMin: 60,
    sortOrder: 6,
    description: 'Massage using essential oils.',
    active: true,
  },
  {
    name: 'Pregnancy Massage',
    slug: 'pregnancy-massage',
    category: 'Massage',
    price: 900,
    duration: '60 min',
    durationMin: 60,
    sortOrder: 7,
    description: 'Safe prenatal massage.',
    active: true,
  },
  {
    name: 'Full Body Massage',
    slug: 'full-body-massage',
    category: 'Massage',
    price: 1000,
    duration: '90 min',
    durationMin: 90,
    sortOrder: 8,
    description: 'Complete body massage.',
    active: true,
  },
  {
    name: 'Thai Massage',
    slug: 'thai-massage',
    category: 'Massage',
    price: 1100,
    duration: '90 min',
    durationMin: 90,
    sortOrder: 9,
    description: 'Traditional Thai massage.',
    active: true,
  },
  {
    name: 'Deep Tissue Massage',
    slug: 'deep-tissue-massage',
    category: 'Massage',
    price: 1200,
    duration: '90 min',
    durationMin: 90,
    sortOrder: 10,
    description: 'Deep muscle therapy.',
    active: true,
  },
  {
    name: 'Four Hands Massage',
    slug: 'four-hands-massage',
    category: 'Luxury',
    price: 1200,
    duration: '60 min',
    durationMin: 60,
    sortOrder: 11,
    description: 'Two therapists working together.',
    active: true,
  },
  {
    name: 'Couples Massage',
    slug: 'couples-massage',
    category: 'Massage',
    price: 2000,
    duration: '90 min',
    durationMin: 90,
    sortOrder: 12,
    description: 'Massage for two.',
    active: true,
  },
  {
    name: 'Body Scrub',
    slug: 'body-scrub',
    category: 'Body Treatment',
    price: 800,
    duration: '60 min',
    durationMin: 60,
    sortOrder: 13,
    description: 'Luxury exfoliating body scrub.',
    active: true,
  }
];

async function main() {

  for (const service of services) {

    const existing = await prisma.service.findFirst({
      where: { slug: service.slug }
    });

    if (existing) {

      await prisma.service.update({
        where: { id: existing.id },
        data: service
      });

    } else {

      await prisma.service.create({
        data: {
          id: crypto.randomUUID(),
          ...service
        }
      });

    }

  }

  console.table(
    await prisma.service.findMany({
      orderBy: { sortOrder: 'asc' },
      select: {
        name: true,
        price: true
      }
    })
  );
}

main()
.finally(async()=>await prisma.$disconnect());
