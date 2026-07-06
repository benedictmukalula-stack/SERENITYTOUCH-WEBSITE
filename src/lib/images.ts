export const THERAPIST_TINA = 'https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=400&q=80';

export const images = {
  hero: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=1920&q=80',
  services: {
    'head-scalp': 'https://images.unsplash.com/photo-1611073615830-4ebed33c0e5b?w=600&q=80',
    'foot-massage': 'https://images.unsplash.com/photo-1540555700478-4be289fbec6d?w=600&q=80',
    'back-neck-shoulder': 'https://images.unsplash.com/photo-1517602436811-4ed606917e01?w=600&q=80',
    'swedish': 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=600&q=80',
    'deep-tissue': 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=600&q=80',
    'thai': 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80',
    'aromatherapy': 'https://images.unsplash.com/photo-1596178060671-7a80dc8059ea?w=600&q=80',
    'reflexology': 'https://images.unsplash.com/photo-1540555700478-4be289fbec6d?w=600&q=80',
    'pregnancy': 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=600&q=80',
    'full-body': 'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=600&q=80',
    'couples': 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80',
  },
  therapists: {
    tina: THERAPIST_TINA,
    grace: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80',
    patricia: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
    chipo: 'https://images.unsplash.com/photo-1586195500755-4aae5e8e56e5?w=400&q=80',
  },
  logo: '/logo.jpg',
};

export function getServiceImage(slug: string): string {
  return (images.services as Record<string, string>)[slug] || images.hero;
}

export function getTherapistImage(name: string): string {
  const key = name.toLowerCase().split(' ')[0] as keyof typeof images.therapists;
  return images.therapists[key] || THERAPIST_TINA;
}