import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function seed() {
  console.log('Seeding database...');

  // Site Config
  const configs = [
    { key: 'spa_name', value: 'Serenity Touch Spa' },
    { key: 'spa_address', value: '183 Ibex Hill, Lusaka, Zambia' },
    { key: 'spa_phone', value: '+260 572 782 539' },
    { key: 'spa_whatsapp', value: '+260 761 404 555' },
    { key: 'spa_email_bookings', value: 'bookings@serenitytouch.co.za' },
    { key: 'spa_email_payments', value: 'payments@serenitytouch.co.za' },
    { key: 'spa_email_taonga', value: 'taonga@serenitytouch.co.za' },
    { key: 'spa_email', value: 'info@serenitytouch.co.za' },
    { key: 'spa_hours_weekday', value: '9:00 AM - 6:00 PM' },
    { key: 'spa_hours_saturday', value: '10:00 AM - 5:00 PM' },
    { key: 'spa_hours_sunday', value: 'Closed' },
    { key: 'mobile_money_airtel', value: '+260 761 404 555' },
    { key: 'mobile_money_mtn', value: '+260 977 555 123' },
    { key: 'payment_card_line1', value: 'Serenity Touch Spa' },
    { key: 'payment_card_line2', value: 'Account: 1234567890' },
    { key: 'payment_bank_name', value: 'ZANACO' },
    { key: 'payment_bank_account', value: '1234567890' },
    { key: 'payment_bank_branch', value: 'Ibex Hill, Lusaka' },
  ];
  for (const c of configs) {
    await db.siteConfig.upsert({ where: { key: c.key }, update: { value: c.value }, create: c });
  }

  // Services
  const services = [
    { slug: 'head-scalp', name: 'Head & Scalp Massage', category: 'Massage', price: 400, duration: '30 min', durationMin: 30, description: 'A calming scalp massage that relieves tension headaches and promotes hair health through gentle circular techniques.', benefits: 'Relieves headaches, reduces stress, promotes hair growth', image: 'https://images.unsplash.com/photo-1611073615830-4ebed33c0e5b?w=600&q=80', sortOrder: 1 },
    { slug: 'foot-massage', name: 'Foot Massage', category: 'Massage', price: 500, duration: '45 min', durationMin: 45, description: 'Targeted foot therapy using reflexology pressure points to restore balance and relieve tension throughout the body.', benefits: 'Improves circulation, relieves foot pain, reduces stress', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbec6d?w=600&q=80', sortOrder: 2 },
    { slug: 'back-neck-shoulder', name: 'Back, Neck & Shoulder', category: 'Massage', price: 600, duration: '45 min', durationMin: 45, description: 'Focused deep tissue work on the most tension-prone areas. Perfect for desk workers and those with chronic upper body pain.', benefits: 'Relieves muscle knots, improves posture, reduces pain', image: 'https://images.unsplash.com/photo-1517602436811-4ed606917e01?w=600&q=80', sortOrder: 3 },
    { slug: 'swedish', name: 'Swedish Massage', category: 'Massage', price: 800, duration: '60 min', durationMin: 60, description: 'The classic full-body massage using flowing, rhythmic strokes to promote deep relaxation, improve circulation, and ease muscle tension.', benefits: 'Deep relaxation, improved circulation, stress relief', image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=600&q=80', sortOrder: 4 },
    { slug: 'reflexology', name: 'Reflexology', category: 'Specialized', price: 850, duration: '45 min', durationMin: 45, description: 'Ancient healing art applying pressure to specific points on feet and hands corresponding to body organs and systems.', benefits: 'Restores energy flow, improves organ function, deep relaxation', image: 'https://images.unsplash.com/photo-1517602436811-4ed606917e01?w=600&q=80', sortOrder: 5 },
    { slug: 'aromatherapy', name: 'Aromatherapy Massage', category: 'Massage', price: 900, duration: '60 min', durationMin: 60, description: 'A sensory journey combining essential oils with massage techniques. Choose from our curated blends for stress relief, energy, or sleep.', benefits: 'Enhanced relaxation, mood elevation, skin nourishment', image: 'https://images.unsplash.com/photo-1596178060671-7a80dc8059ea?w=600&q=80', sortOrder: 6 },
    { slug: 'pregnancy', name: 'Pregnancy Massage', category: 'Specialized', price: 900, duration: '60 min', durationMin: 60, description: 'Gentle, nurturing massage specially designed for expectant mothers. Eases pregnancy-related aches and promotes wellbeing.', benefits: 'Reduces swelling, eases back pain, improves sleep', image: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=600&q=80', sortOrder: 7 },
    { slug: 'thai', name: 'Thai Massage', category: 'Massage', price: 1100, duration: '90 min', durationMin: 90, description: 'An invigorating ancient practice combining acupressure, assisted yoga stretches, and rhythmic compression for total body rejuvenation.', benefits: 'Increases flexibility, relieves tension, boosts energy', image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80', sortOrder: 8 },
    { slug: 'full-body', name: 'Full Body Massage', category: 'Massage', price: 1000, duration: '90 min', durationMin: 90, description: 'Our signature comprehensive massage treating every major muscle group. Customized pressure and techniques for your needs.', benefits: 'Total body relaxation, improved flexibility, pain relief', image: 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=600&q=80', sortOrder: 9 },
    { slug: 'deep-tissue', name: 'Deep Tissue Massage', category: 'Massage', price: 1200, duration: '75 min', durationMin: 75, description: 'Intensive therapeutic massage targeting deep muscle layers and connective tissue. Ideal for chronic pain and sports recovery.', benefits: 'Chronic pain relief, breaks down adhesions, improves mobility', image: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=600&q=80', sortOrder: 10 },
    { slug: 'couples', name: 'Couples Massage', category: 'Premium', price: 2000, duration: '90 min', durationMin: 90, description: 'Share the luxury experience side by side. Both partners receive simultaneous treatments in our private couples suite.', benefits: 'Bonding experience, shared relaxation, memorable occasion', image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80', sortOrder: 11 },
  ];

  for (const s of services) {
    await db.service.upsert({ where: { slug: s.slug }, update: s, create: s });
  }

  // Service Addons
  const svcs = await db.service.findMany();
  const swedish = svcs.find(s => s.slug === 'swedish')!;
  const deepTissue = svcs.find(s => s.slug === 'deep-tissue')!;
  const fullBody = svcs.find(s => s.slug === 'full-body')!;

  const addons = [
    { name: 'Hot Stones', price: 200, description: 'Heated basalt stones for deeper muscle relaxation', icon: '🔥', serviceId: swedish.id },
    { name: 'Aromatherapy Oils', price: 150, description: 'Premium essential oil blend of your choice', icon: '🌿', serviceId: swedish.id },
    { name: 'Scalp Massage Add-on', price: 100, description: 'Extended scalp treatment with nourishing oils', icon: '💆', serviceId: deepTissue.id },
    { name: 'Foot Reflexology Add-on', price: 150, description: 'Targeted foot reflexology to complement body work', icon: '🦶', serviceId: fullBody.id },
    { name: 'Deep Heat Therapy', price: 200, description: 'Thermotherapy for chronic muscle tension', icon: '♨️', serviceId: deepTissue.id },
  ];
  for (const a of addons) {
    await db.serviceAddon.upsert({ where: { id: `${a.serviceId}-${a.name.toLowerCase().replace(/\s/g, '-')}` }, update: a, create: { ...a, id: `${a.serviceId}-${a.name.toLowerCase().replace(/\s/g, '-')}` } });
  }

  // Therapists
  const therapists = [
    { name: 'Taonga Phiri', specialty: 'Swedish, Deep Tissue, Aromatherapy', bio: 'Lead therapist and founder with 12 years of wellness expertise. Certified in multiple massage modalities.', image: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&q=80', sortOrder: 1 },
    { name: 'Grace Phiri', specialty: 'Aromatherapy, Pregnancy, Reflexology', bio: 'Specialist in prenatal and holistic treatments. Known for her gentle, nurturing approach.', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80', sortOrder: 2 },
    { name: 'Patricia Banda', specialty: 'Thai, Reflexology, Sports Massage', bio: 'Trained in traditional Thai massage in Bangkok. Brings authentic Eastern techniques to Lusaka.', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80', sortOrder: 3 },
    { name: 'Chipo Mulenga', specialty: 'Couples, Full Body, Hot Stone', bio: 'Expert in premium spa experiences. Specializes in creating memorable couples treatments.', image: 'https://images.unsplash.com/photo-1586195500755-4aae5e8e56e5?w=400&q=80', sortOrder: 4 },
  ];
  for (const t of therapists) {
    await db.therapist.upsert({ where: { id: t.name.toLowerCase().replace(/\s/g, '-') }, update: t, create: { ...t, id: t.name.toLowerCase().replace(/\s/g, '-') } });
  }

  // Testimonials
  const testimonials = [
    { name: 'Sarah Mwenda', rating: 5, content: 'Absolutely incredible experience. The deep tissue massage was exactly what I needed after weeks of back pain. Taonga is truly gifted!', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80', service: 'Deep Tissue Massage', featured: true, sortOrder: 1 },
    { name: 'James Chanda', rating: 5, content: 'Best spa in Lusaka, hands down. The couples massage was a perfect anniversary treat. We will definitely be back.', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80', service: 'Couples Massage', featured: true, sortOrder: 2 },
    { name: 'Mwansa Kapila', rating: 5, content: 'The aromatherapy session was heavenly. Grace made me feel so relaxed, I almost fell asleep. The oils smelled amazing.', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80', service: 'Aromatherapy Massage', featured: true, sortOrder: 3 },
    { name: 'David Mulenga', rating: 4, content: 'Great Thai massage experience. Patricia really knows her stuff. The stretching techniques were exactly what my body needed.', image: 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=200&q=80', service: 'Thai Massage', featured: false, sortOrder: 4 },
    { name: 'Chimwemwe Banda', rating: 5, content: 'The pregnancy massage was so gentle and relaxing. It really helped with my back pain. Highly recommend for expectant mothers!', image: 'https://images.unsplash.com/photo-1586195500755-4aae5e8e56e5?w=200&q=80', service: 'Pregnancy Massage', featured: false, sortOrder: 5 },
  ];
  for (const t of testimonials) {
    await db.testimonial.create({ data: t });
  }

  // Demo Member
  const hashedPw = 'demo2026'; // In production, use bcrypt
  await db.member.upsert({
    where: { email: 'taonga@serenitytouch.co.za' },
    update: {},
    create: {
      name: 'Taonga Phiri', email: 'taonga@serenitytouch.co.za', phone: '+260 977 123 456',
      password: hashedPw, tier: 'Gold', points: 1250,
    },
  });

  // Blog Posts
  const posts = [
    { title: 'The Benefits of Regular Massage Therapy', slug: 'benefits-regular-massage', excerpt: 'Discover how consistent massage treatments can transform your physical and mental wellbeing.', content: 'Regular massage therapy offers numerous benefits beyond simple relaxation. Studies show that consistent treatments can reduce cortisol levels by up to 30%, improve sleep quality, boost immune function, and reduce chronic pain. At Serenity Touch Spa, we recommend monthly sessions for optimal wellness benefits.', category: 'Wellness', image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80', author: 'Serenity Touch Team' },
    { title: 'Self-Care Sunday: Your Home Spa Routine', slug: 'self-care-sunday-home-spa', excerpt: 'Create a spa-like experience at home with our expert tips and techniques.', content: 'Transform your Sunday into a spa day with these simple steps: Start with dry brushing to stimulate circulation, follow with a warm bath using Epsom salts and essential oils, apply a nourishing body oil, and finish with a calming face mask. Light candles and play soft music for the full Serenity Touch experience at home.', category: 'Tips', image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=600&q=80', author: 'Taonga Phiri' },
    { title: 'Understanding Deep Tissue Massage', slug: 'understanding-deep-tissue', excerpt: 'What to expect from your first deep tissue session and why it might change your life.', content: 'Deep tissue massage targets the inner layers of your muscles and connective tissue. Unlike Swedish massage which uses lighter pressure, deep tissue uses firm pressure and slow strokes to reach deeper muscle layers. It is especially helpful for chronic aches, stiff neck, upper back pain, and muscle tightness.', category: 'Education', image: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=600&q=80', author: 'Patricia Banda' },
  ];
  for (const p of posts) {
    await db.blogPost.upsert({ where: { slug: p.slug }, update: p, create: p });
  }

  console.log('Seed complete!');
}

seed()
  .catch(console.error)
  .finally(() => db.$disconnect());