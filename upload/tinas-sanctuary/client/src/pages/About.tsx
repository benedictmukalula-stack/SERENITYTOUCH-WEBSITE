import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";

export default function About() {
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
            <Link href="/therapists">
              <a className="text-sm text-gray-700 hover:text-gray-900 transition">Therapists</a>
            </Link>
            <Link href="/blog">
              <a className="text-sm text-gray-700 hover:text-gray-900 transition">Journal</a>
            </Link>
            <a href="#about" className="text-sm text-gray-700 hover:text-gray-900 transition font-semibold">About</a>
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
          <h1 className="text-5xl md:text-6xl font-bold mb-6" style={{ fontFamily: "Playfair Display" }}>About Tina's Sanctuary</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto" style={{ fontFamily: "Lora" }}>
            A private wellness sanctuary dedicated to delivering the finest therapeutic experience in Lusaka.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section id="about" className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-4xl font-bold mb-8" style={{ fontFamily: "Playfair Display" }}>Our Story</h2>
          <div className="space-y-6 text-gray-700" style={{ fontFamily: "Lora" }}>
            <p>
              Tina's Sanctuary was founded with a singular vision: to create a private, luxurious wellness space where the finest therapeutic practices meet personalized care. Located in the heart of Ibex Hill, Lusaka, our sanctuary represents more than a spa—it's a refuge for those seeking genuine transformation.
            </p>
            <p>
              Every detail has been carefully considered, from the silk-draped treatment suites to the in-house blended oils. We believe that true wellness comes from rituals composed specifically for you—treatments that honor your body, respect your time, and celebrate your commitment to self-care.
            </p>
            <p>
              Our team of internationally certified therapists brings decades of combined experience and an unwavering commitment to excellence. We don't just provide treatments; we craft personalized rituals that leave you feeling transformed.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16" style={{ fontFamily: "Playfair Display" }}>Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Authenticity",
                description: "We believe in genuine care, not superficial luxury. Every interaction reflects our commitment to your wellbeing."
              },
              {
                title: "Excellence",
                description: "We maintain the highest standards in every aspect—from therapist certification to the quality of our oils and linens."
              },
              {
                title: "Discretion",
                description: "Your privacy is paramount. We maintain encrypted records and create a confidential space for your wellness journey."
              },
              {
                title: "Personalization",
                description: "No two guests are the same. We tailor every treatment to your unique needs, preferences, and wellness goals."
              },
              {
                title: "Community",
                description: "We celebrate Zambian talent and source locally-produced botanicals to support our community."
              },
              {
                title: "Sustainability",
                description: "We're committed to ethical practices and environmentally conscious choices in everything we do."
              }
            ].map((value, idx) => (
              <Card key={idx} className="p-8 border-0 shadow-sm">
                <h3 className="text-xl font-bold mb-4" style={{ fontFamily: "Playfair Display" }}>{value.title}</h3>
                <p className="text-gray-600" style={{ fontFamily: "Lora" }}>{value.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Membership Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-4xl font-bold text-center mb-12" style={{ fontFamily: "Playfair Display" }}>Join Our Community</h2>
          <p className="text-center text-gray-600 mb-12" style={{ fontFamily: "Lora" }}>
            Become a member and unlock exclusive benefits, priority booking, and personalized wellness experiences.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Silver", price: "K800", color: "bg-gray-100" },
              { name: "Gold", price: "K1,600", color: "bg-yellow-50" },
              { name: "Platinum", price: "K3,200", color: "bg-purple-50" }
            ].map((plan, idx) => (
              <Card key={idx} className={`p-8 border-0 text-center ${plan.color}`}>
                <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: "Playfair Display" }}>{plan.name}</h3>
                <p className="text-3xl font-bold text-gray-900 mb-6">{plan.price}<span className="text-lg text-gray-600">/mo</span></p>
                <Link href="/contact">
                  <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-full">Learn More</Button>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold mb-6" style={{ fontFamily: "Playfair Display" }}>Begin Your Transformation</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto" style={{ fontFamily: "Lora" }}>
            Experience the sanctuary that's changing how Lusaka approaches wellness.
          </p>
          <Link href="/contact">
            <Button size="lg" className="bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-full px-8">
              Book Your First Session
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
