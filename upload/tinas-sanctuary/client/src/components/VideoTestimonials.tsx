import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Play, X } from "lucide-react";
import ReactPlayer from "react-player";

interface Testimonial {
  id: string;
  name: string;
  location: string;
  title: string;
  videoUrl: string;
  thumbnail: string;
}

export default function VideoTestimonials() {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const testimonials: Testimonial[] = [
    {
      id: "1",
      name: "Chipo Mwale",
      location: "Lusaka",
      title: "Transformed My Wellness Journey",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    },
    {
      id: "2",
      name: "Bwalya Nkomo",
      location: "Kitwe",
      title: "Best Spa Experience in Zambia",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    },
    {
      id: "3",
      name: "Grace Banda",
      location: "Lusaka",
      title: "Personalized Care & Attention",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    },
    {
      id: "4",
      name: "Patricia Mulenga",
      location: "Lusaka",
      title: "Discretion & Excellence",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      thumbnail: "https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    },
  ];

  return (
    <div className="w-full">
      <div className="text-center mb-12">
        <p className="text-xs tracking-widest text-[#D4A574] mb-4" style={{ fontFamily: "Playfair Display" }}>
          CLIENT STORIES
        </p>
        <h2 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: "Playfair Display" }}>
          Hear from Our Members
        </h2>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Watch real testimonials from our satisfied clients about their transformation at Tina's Sanctuary
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {testimonials.map((testimonial) => (
          <Card
            key={testimonial.id}
            className="group relative overflow-hidden bg-[#1a1a1a] border border-[rgba(212,165,116,0.3)] hover:border-[rgba(212,165,116,0.6)] transition cursor-pointer"
            onClick={() => setSelectedVideo(testimonial.videoUrl)}
          >
            <div className="relative h-64 overflow-hidden">
              <img
                src={testimonial.thumbnail}
                alt={testimonial.name}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition flex items-center justify-center">
                <div className="bg-[#E91E63] rounded-full p-4 group-hover:scale-110 transition">
                  <Play className="w-6 h-6 text-white fill-white" />
                </div>
              </div>
            </div>
            <div className="p-6">
              <h3 className="font-bold text-white mb-1">{testimonial.name}</h3>
              <p className="text-sm text-[#D4A574] mb-3">{testimonial.location}</p>
              <p className="text-gray-300 text-sm">{testimonial.title}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <Card className="w-full max-w-4xl bg-[#1a1a1a] border border-[rgba(212,165,116,0.3)]">
            <div className="flex items-center justify-between p-4 border-b border-[rgba(212,165,116,0.2)]">
              <h3 className="text-white font-bold">Client Testimonial</h3>
              <button
                onClick={() => setSelectedVideo(null)}
                className="text-gray-400 hover:text-white transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="relative w-full pt-[56.25%]">
              <iframe
                className="absolute inset-0 w-full h-full"
                src={selectedVideo}
                title="Client Testimonial"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
