import { getDb } from "./db";
import { galleryImages } from "../drizzle/schema";

const sampleGalleryImages = [
  {
    title: "Luxurious Treatment Suite",
    description: "Our main treatment room featuring silk-draped walls and ambient lighting",
    category: "treatment-room",
    imageUrl: "https://images.unsplash.com/photo-1600881333195-8374dc7f3b4d?w=800",
    displayOrder: 1,
  },
  {
    title: "Aromatherapy Station",
    description: "Carefully curated essential oils and botanical blends for personalized treatments",
    category: "amenities",
    imageUrl: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=800",
    displayOrder: 2,
  },
  {
    title: "Massage Therapy Room",
    description: "Dedicated space for therapeutic massage with heated massage tables",
    category: "treatment-room",
    imageUrl: "https://images.unsplash.com/photo-1600881333195-8374dc7f3b4d?w=800",
    displayOrder: 3,
  },
  {
    title: "Wellness Consultation Area",
    description: "Private consultation space for personalized wellness planning",
    category: "amenities",
    imageUrl: "https://images.unsplash.com/photo-1576091160550-112173f7f869?w=800",
    displayOrder: 4,
  },
  {
    title: "Therapist Profile - Amara",
    description: "Certified massage therapist specializing in deep tissue and hot stone therapy",
    category: "therapist",
    imageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800",
    displayOrder: 5,
  },
  {
    title: "Therapist Profile - Zainab",
    description: "Expert in aromatherapy and holistic wellness treatments",
    category: "therapist",
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
    displayOrder: 6,
  },
  {
    title: "Relaxation Lounge",
    description: "Comfortable member lounge with herbal tea and wellness reading materials",
    category: "amenities",
    imageUrl: "https://images.unsplash.com/photo-1567521464027-f127ff144326?w=800",
    displayOrder: 7,
  },
  {
    title: "Premium Skincare Products",
    description: "Luxury skincare line used in all our treatments",
    category: "products",
    imageUrl: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800",
    displayOrder: 8,
  },
];

export async function seedGallery() {
  const db = await getDb();
  if (!db) {
    console.error("[Seed] Database not available");
    return;
  }

  try {
    console.log("[Seed] Starting gallery population...");
    
    for (const image of sampleGalleryImages) {
      await db.insert(galleryImages).values({
        title: image.title,
        description: image.description,
        category: image.category,
        imageUrl: image.imageUrl,
        displayOrder: image.displayOrder,
        createdAt: new Date(),
      });
    }
    
    console.log(`[Seed] Successfully populated ${sampleGalleryImages.length} gallery images`);
  } catch (error) {
    console.error("[Seed] Error populating gallery:", error);
  }
}

// Run seed if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedGallery().then(() => {
    console.log("[Seed] Gallery seeding complete");
    process.exit(0);
  });
}
