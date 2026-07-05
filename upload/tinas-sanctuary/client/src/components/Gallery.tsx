import { trpc } from "@/lib/trpc";
import { Loader2 } from "lucide-react";

interface GalleryProps {
  category: "services" | "therapists" | "facilities";
  title?: string;
}

export default function Gallery({ category, title }: GalleryProps) {
  const { data: images, isLoading } = trpc.gallery.list.useQuery({ category });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="py-12">
      {title && (
        <h3 className="text-2xl font-bold mb-8 text-center" style={{ fontFamily: "Playfair Display" }}>
          {title}
        </h3>
      )}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {images.map((image) => (
          <div
            key={image.id}
            className="rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition group"
          >
            <div className="relative overflow-hidden bg-gray-200 aspect-square">
              <img
                src={image.imageUrl}
                alt={image.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
            </div>
            <div className="p-4 bg-white">
              <h4 className="font-bold text-lg mb-2">{image.title}</h4>
              {image.description && (
                <p className="text-sm text-gray-600">{image.description}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
