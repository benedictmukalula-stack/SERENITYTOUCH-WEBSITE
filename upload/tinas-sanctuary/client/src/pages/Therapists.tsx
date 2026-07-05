import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";

export default function Therapists() {
  const therapists = [
    {
      id: 1,
      name: "Tina Mulenga",
      title: "Founder & Lead Therapist",
      specialties: ["Swedish Massage", "Deep Tissue", "Aromatherapy"],
      certification: "International Spa & Wellness Association (ISWA)",
      experience: "15+ years",
      bio: "Tina founded Sanctuary with a vision to bring world-class wellness to Lusaka. Her holistic approach combines traditional techniques with modern therapeutic practices.",
      image: "/manus-storage/wellness-ritual_6db18ac4.jpg"
    },
    {
      id: 2,
      name: "Grace Banda",
      title: "Senior Massage Therapist",
      specialties: ["Hot Stone Therapy", "Reflexology", "Swedish Massage"],
      certification: "National Board of Certification for Therapeutic Massage (NBCTM)",
      experience: "12+ years",
      bio: "Grace brings warmth and intuition to every session. Her expertise in hot stone therapy and reflexology helps guests achieve deep relaxation and balance.",
      image: "/manus-storage/wellness-ritual_6db18ac4.jpg"
    },
    {
      id: 3,
      name: "Patricia Nkomo",
      title: "Aromatherapy Specialist",
      specialties: ["Aromatherapy", "Essential Oil Blending", "Wellness Consultation"],
      certification: "International Federation of Aromatherapists (IFA)",
      experience: "10+ years",
      bio: "Patricia's passion for botanical wellness shines through her personalized aromatherapy treatments. She sources and blends our signature oils with care.",
      image: "/manus-storage/wellness-ritual_6db18ac4.jpg"
    },
    {
      id: 4,
      name: "Chipo Mwale",
      title: "Therapeutic Massage Specialist",
      specialties: ["Deep Tissue", "Sports Massage", "Couples Massage"],
      certification: "Sports Massage Association (SMA)",
      experience: "8+ years",
      bio: "Chipo specializes in therapeutic and sports massage, helping clients recover from tension and injury. Her strong technique is balanced with genuine care.",
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
            <Link href="/services">
              <a className="text-sm text-gray-700 hover:text-gray-900 transition">Services</a>
            </Link>
            <a href="#therapists" className="text-sm text-gray-700 hover:text-gray-900 transition font-semibold">Therapists</a>
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
          <h1 className="text-5xl md:text-6xl font-bold mb-6" style={{ fontFamily: "Playfair Display" }}>Meet Our Team</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto" style={{ fontFamily: "Lora" }}>
            Every therapist at Tina's Sanctuary is internationally certified and continually trained in the latest therapeutic techniques. Meet the experts dedicated to your wellness.
          </p>
        </div>
      </section>

      {/* Therapists Grid */}
      <section id="therapists" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            {therapists.map((therapist) => (
              <Card key={therapist.id} className="overflow-hidden border-0 shadow-sm hover:shadow-lg transition">
                <div className="md:flex">
                  <div className="md:w-1/3 bg-gray-200 h-48 md:h-auto">
                    <img src={therapist.image} alt={therapist.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-8 md:w-2/3">
                    <h3 className="text-2xl font-bold mb-1 text-gray-900" style={{ fontFamily: "Playfair Display" }}>{therapist.name}</h3>
                    <p className="text-sm font-semibold text-pink-500 mb-4">{therapist.title}</p>
                    
                    <p className="text-gray-600 mb-6 text-sm" style={{ fontFamily: "Lora" }}>{therapist.bio}</p>
                    
                    <div className="space-y-3 mb-6 text-sm">
                      <div>
                        <p className="text-xs font-semibold text-gray-500 mb-1">EXPERIENCE</p>
                        <p className="text-gray-700">{therapist.experience}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500 mb-1">CERTIFICATION</p>
                        <p className="text-gray-700">{therapist.certification}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-gray-500 mb-2">SPECIALTIES</p>
                        <div className="flex flex-wrap gap-2">
                          {therapist.specialties.map((specialty, idx) => (
                            <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <Link href="/contact">
                      <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-full">Book with {therapist.name.split(' ')[0]}</Button>
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Certification Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-4xl font-bold text-center mb-12" style={{ fontFamily: "Playfair Display" }}>Our Commitment to Excellence</h2>
          <div className="space-y-8">
            <Card className="p-8 border-0">
              <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: "Playfair Display" }}>Continuous Training</h3>
              <p className="text-gray-700 mb-6" style={{ fontFamily: "Lora" }}>
                All therapists undergo regular professional development and training to stay current with the latest therapeutic techniques and wellness practices.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-gray-400 mt-1">✦</span>
                  <div>
                    <p className="font-semibold">International Certifications</p>
                    <p className="text-sm text-gray-600">All practitioners hold recognized international credentials</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gray-400 mt-1">✦</span>
                  <div>
                    <p className="font-semibold">Annual Workshops</p>
                    <p className="text-sm text-gray-600">Ongoing education in new techniques and wellness modalities</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gray-400 mt-1">✦</span>
                  <div>
                    <p className="font-semibold">Client-Centered Approach</p>
                    <p className="text-sm text-gray-600">Personalized treatments tailored to individual needs and preferences</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-gray-400 mt-1">✦</span>
                  <div>
                    <p className="font-semibold">Wellness Consultation</p>
                    <p className="text-sm text-gray-600">Pre-treatment consultations to understand your wellness goals</p>
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
          <h2 className="text-5xl font-bold mb-6" style={{ fontFamily: "Playfair Display" }}>Experience expert care</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto" style={{ fontFamily: "Lora" }}>
            Book a session with one of our certified therapists and discover the difference expert care makes.
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
