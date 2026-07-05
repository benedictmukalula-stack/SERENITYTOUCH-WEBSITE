import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import { Link } from "wouter";

export default function Services() {
  const services = [
    {
      id: 1,
      name: "Swedish Massage",
      duration: "60 min",
      price: "K800",
      description: "Classic full-body massage using long, flowing strokes to promote relaxation and improve circulation. Perfect for first-time visitors seeking gentle therapeutic relief.",
      benefits: ["Improved circulation", "Reduced muscle tension", "Enhanced relaxation", "Better sleep quality"],
      image: "/manus-storage/wellness-ritual_6db18ac4.jpg"
    },
    {
      id: 2,
      name: "Deep Tissue Massage",
      duration: "90 min",
      price: "K1,200",
      description: "Intensive massage targeting deep muscle layers to relieve tension and chronic pain. Ideal for those with persistent muscle tightness or athletic recovery.",
      benefits: ["Chronic pain relief", "Improved mobility", "Muscle recovery", "Tension release"],
      image: "/manus-storage/wellness-ritual_6db18ac4.jpg"
    },
    {
      id: 3,
      name: "Hot Stone Therapy",
      duration: "75 min",
      price: "K1,000",
      description: "Heated basalt stones combined with massage to melt tension and induce deep relaxation. The warmth penetrates muscles for therapeutic healing.",
      benefits: ["Deep muscle relaxation", "Improved blood flow", "Stress relief", "Detoxification"],
      image: "/manus-storage/wellness-ritual_6db18ac4.jpg"
    },
    {
      id: 4,
      name: "Aromatherapy Treatment",
      duration: "60 min",
      price: "K900",
      description: "Personalized aromatherapy session using locally-sourced essential oils blended in-house. Tailored to your mood, season, and wellness goals.",
      benefits: ["Emotional balance", "Mental clarity", "Stress reduction", "Holistic wellness"],
      image: "/manus-storage/wellness-ritual_6db18ac4.jpg"
    },
    {
      id: 5,
      name: "Couples Massage",
      duration: "90 min",
      price: "K2,000",
      description: "Synchronized massage experience for two in our private couples suite. Share a moment of relaxation and connection in our most intimate setting.",
      benefits: ["Shared wellness", "Quality time", "Synchronized relaxation", "Intimate experience"],
      image: "/manus-storage/wellness-ritual_6db18ac4.jpg"
    },
    {
      id: 6,
      name: "Reflexology",
      duration: "60 min",
      price: "K850",
      description: "Ancient healing practice targeting reflex points on feet and hands to promote whole-body wellness and balance.",
      benefits: ["Energy balance", "Improved circulation", "Stress relief", "Holistic healing"],
      image: "/manus-storage/wellness-ritual_6db18ac4.jpg"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <img src="/manus-storage/tinas-logo_63d84348.png" alt="Tina's Sanctuary" className="h-8 w-8" />
              <span className="text-lg font-bold text-gray-900" style={{ fontFamily: "Playfair Display" }}>Tina's Sanctuary</span>
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="/">
              <a className="text-sm text-gray-700 hover:text-gray-900 transition">Home</a>
            </Link>
            <a href="#services" className="text-sm text-gray-700 hover:text-gray-900 transition font-semibold">Services</a>
            <Link href="/therapists">
              <a className="text-sm text-gray-700 hover:text-gray-900 transition">Therapists</a>
            </Link>
            <Link href="/blog">
              <a className="text-sm text-gray-700 hover:text-gray-900 transition">Journal</a>
            </Link>
            <Link href="/about">
              <a className="text-sm text-gray-700 hover:text-gray-900 transition">About</a>
            </Link>
            <Link href="/contact">
              <a className="text-sm text-gray-700 hover:text-gray-900 transition">Contact</a>
            </Link>
            <Button className="text-sm bg-pink-500 text-white border-0 hover:bg-pink-600 rounded-full px-6">Sign in</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6" style={{ fontFamily: "Playfair Display" }}>Our Signature Treatments</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto" style={{ fontFamily: "Lora" }}>
            Every treatment is composed for you — from the oils blended in-house to the temperature of the linen. Discover the ritual that speaks to your wellness journey.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section id="services" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            {services.map((service) => (
              <Card key={service.id} className="overflow-hidden border-0 shadow-sm hover:shadow-lg transition">
                <div className="md:flex">
                  <div className="md:w-1/3 bg-gray-200 h-48 md:h-auto">
                    <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-8 md:w-2/3">
                    <p className="text-xs tracking-widest text-gray-500 mb-2">{service.duration}</p>
                    <h3 className="text-2xl font-bold mb-3 text-gray-900" style={{ fontFamily: "Playfair Display" }}>{service.name}</h3>
                    <p className="text-gray-600 mb-6 text-sm" style={{ fontFamily: "Lora" }}>{service.description}</p>
                    
                    <div className="mb-6">
                      <p className="text-xs font-semibold text-gray-500 mb-3">KEY BENEFITS</p>
                      <ul className="space-y-2">
                        {service.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm">
                            <span className="text-gray-400">✦</span>
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-gray-900">{service.price}</span>
                      <Link href="/contact">
                        <Button className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-6">Book Now</Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Customization Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-4xl font-bold text-center mb-12" style={{ fontFamily: "Playfair Display" }}>Personalized Rituals</h2>
          <div className="space-y-8">
            <Card className="p-8 border-0">
              <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: "Playfair Display" }}>Customize Your Experience</h3>
              <p className="text-gray-700 mb-6" style={{ fontFamily: "Lora" }}>
                Every guest is unique. We offer customization options for all treatments including:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-gray-400 mt-1">✦</span>
                  <div>
                    <p className="font-semibold">Oil Selection</p>
                    <p className="text-sm text-gray-600">Choose from our collection of locally-sourced essential oils</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gray-400 mt-1">✦</span>
                  <div>
                    <p className="font-semibold">Pressure Preference</p>
                    <p className="text-sm text-gray-600">Light, medium, or deep pressure tailored to your comfort</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gray-400 mt-1">✦</span>
                  <div>
                    <p className="font-semibold">Temperature Control</p>
                    <p className="text-sm text-gray-600">Adjust room temperature and linen warmth to your preference</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gray-400 mt-1">✦</span>
                  <div>
                    <p className="font-semibold">Duration Extension</p>
                    <p className="text-sm text-gray-600">Add 15 or 30 minutes to any treatment for deeper relaxation</p>
                  </div>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold mb-6" style={{ fontFamily: "Playfair Display" }}>Ready to book your ritual?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto" style={{ fontFamily: "Lora" }}>
            Contact us to reserve your personalized treatment experience.
          </p>
          <Link href="/contact">
            <Button size="lg" className="bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-full px-8">
              Book Your Session
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <h3 className="text-white font-bold text-lg mb-4" style={{ fontFamily: "Playfair Display" }}>Tina's Sanctuary</h3>
              <p className="text-sm">Exclusive wellness sanctuary in Lusaka, Zambia</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Explore</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/"><a className="hover:text-white transition">Home</a></Link></li>
                <li><Link href="/services"><a className="hover:text-white transition">Services</a></Link></li>
                <li><Link href="/therapists"><a className="hover:text-white transition">Therapists</a></Link></li>
                <li><Link href="/blog"><a className="hover:text-white transition">Journal</a></Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Membership</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Silver — K800/mo</a></li>
                <li><a href="#" className="hover:text-white transition">Gold — K1,600/mo</a></li>
                <li><a href="#" className="hover:text-white transition">Platinum — K3,200/mo</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li>183 Ibex Hill, Lusaka, Zambia</li>
                <li><a href="tel:+260572782539" className="hover:text-white transition">+260 572 782 539</a></li>
                <li><a href="mailto:info@tinassanctuary.zm" className="hover:text-white transition">info@tinassanctuary.zm</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row items-center justify-between text-sm">
            <p>© 2026 Tina's Sanctuary. Crafted in Lusaka, Zambia.</p>
            <p>R18 · Members must be 18 or older.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
