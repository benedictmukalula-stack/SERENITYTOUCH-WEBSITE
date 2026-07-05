import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
  import { Card } from "@/components/ui/card";
  import { ChevronRight, ChevronLeft, Star } from "lucide-react";
  import { useState } from "react";

  export default function Home() {
    const [currentTestimonial, setCurrentTestimonial] = useState(0);
    const [expandedFaq, setExpandedFaq] = useState(0);

    const testimonials = [
      {
        text: "Tina's Sanctuary completely transformed my stress levels. After six months as a member I feel like a new person.",
        author: "Chipo Mwale",
        location: "Lusaka"
      },
      {
        text: "The best wellness experience in Zambia. Professional, discreet, and absolutely worth every kwacha.",
        author: "Bwalya Nkomo",
        location: "Kitwe"
      },
      {
        text: "Exceptional service and attention to detail. Every visit feels like a personalized ritual.",
        author: "Grace Banda",
        location: "Lusaka"
      },
      {
        text: "A true sanctuary. The therapists are incredibly skilled and the discretion is unmatched.",
        author: "Patricia Mulenga",
        location: "Lusaka"
      }
    ];

    const faqItems = [
      {
        question: "What makes Tina's Sanctuary different?",
        answer: "Certified expertise, a private luxury setting in Ibex Hill and treatments personalised to every guest."
      },
      {
        question: "How do I book?",
        answer: "You can book through our website contact form, call us at +260 572 782 539, or email info@tinassanctuary.zm. Members enjoy priority booking through our WhatsApp concierge line."
      },
      {
        question: "What is your cancellation policy?",
        answer: "Cancellations made 24 hours in advance receive a full refund. Cancellations within 24 hours are subject to a 50% fee."
      },
      {
        question: "Are your therapists certified?",
        answer: "Yes, every practitioner is internationally certified and continually trained in the latest therapeutic techniques."
      }
    ];

    const nextTestimonial = () => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    };

    const prevTestimonial = () => {
      setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    return (
      <div className="min-h-screen bg-white">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src="/manus-storage/tinas-logo_63d84348.png" alt="Tina's Sanctuary" className="h-8 w-8" />
              <span className="text-lg font-bold text-gray-900" style={{ fontFamily: "Playfair Display" }}>Tina's Sanctuary</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#services" className="text-sm text-gray-700 hover:text-gray-900 transition">Services</a>
              <a href="#therapists" className="text-sm text-gray-700 hover:text-gray-900 transition">Therapists</a>
              <a href="#journal" className="text-sm text-gray-700 hover:text-gray-900 transition">Journal</a>
              <a href="#about" className="text-sm text-gray-700 hover:text-gray-900 transition">About</a>
              <a href="#contact" className="text-sm text-gray-700 hover:text-gray-900 transition">Contact</a>
              <Button className="text-sm bg-pink-500 text-white border-0 hover:bg-pink-600 rounded-full px-6">Sign in</Button>
            </div>
            <Button className="md:hidden">Book</Button>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="pt-32 pb-32 relative overflow-hidden min-h-screen flex items-center">
          <div 
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: "url('/manus-storage/hero-sanctuary_84f64ee3.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: 0.7
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40 z-1" />
          
          <div className="container mx-auto px-4 relative z-10 text-center">
            <div className="mb-6 inline-block">
              <div className="px-4 py-2 rounded-full border border-gold/40 bg-white/5 backdrop-blur-sm">
                <span className="text-xs tracking-widest text-yellow-400" style={{ fontFamily: "Playfair Display" }}>✦ EXCLUSIVE WELLNESS SANCTUARY</span>
              </div>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight text-white" style={{ fontFamily: "Playfair Display" }}>
              <span className="text-yellow-300">Elevate</span> Your <span className="text-pink-400">Wellness</span>
            </h1>
            
            <p className="text-lg text-gray-200 max-w-2xl mx-auto mb-8" style={{ fontFamily: "Lora" }}>
              Tina's Sanctuary is a private sanctuary in Ibex Hill, Lusaka — where certified therapists, silk-draped suites and considered rituals deliver the finest therapeutic experience in Zambia.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-pink-500 hover:bg-pink-600 text-white rounded-full px-8 font-semibold">
                Book Your Session
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-lime-400 text-lime-400 hover:bg-lime-400/10 rounded-full px-8 font-semibold bg-transparent">
                Explore Services
              </Button>
            </div>
          </div>
        </section>

        {/* Signature Treatments */}
        <section id="services" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <p className="text-xs tracking-widest text-gray-500 mb-4" style={{ fontFamily: "Playfair Display" }}>SIGNATURE TREATMENTS</p>
              <h2 className="text-5xl font-bold mb-4" style={{ fontFamily: "Playfair Display" }}>Ritual, refined.</h2>
              <p className="text-gray-600 max-w-2xl mx-auto" style={{ fontFamily: "Lora" }}>
                Every treatment is composed for you — from the oils blended in-house to the temperature of the linen. All prices in Zambian Kwacha.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { duration: "60 min", name: "Swedish Massage", desc: "Classic full-body massage using long, flowing strokes to promote relaxation and improve circulation.", price: "K800" },
                { duration: "90 min", name: "Deep Tissue Massage", desc: "Intensive massage targeting deep muscle layers to relieve tension and chronic pain.", price: "K1,200" },
                { duration: "75 min", name: "Hot Stone Therapy", desc: "Heated basalt stones combined with massage to melt tension and induce deep relaxation.", price: "K1,000" }
              ].map((service, idx) => (
                <Card key={idx} className="p-8 border-0 shadow-sm hover:shadow-lg transition">
                  <p className="text-xs tracking-widest text-gray-500 mb-2">{service.duration}</p>
                  <h3 className="text-2xl font-bold mb-3 text-gray-900" style={{ fontFamily: "Playfair Display" }}>{service.name}</h3>
                  <p className="text-gray-600 mb-6 text-sm" style={{ fontFamily: "Lora" }}>{service.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-900">{service.price}</span>
                    <a href="#" className="text-sm text-gray-700 hover:text-gray-900 transition flex items-center gap-1">
                      View details <ChevronRight className="w-4 h-4" />
                    </a>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Why Members Choose Us */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-16" style={{ fontFamily: "Playfair Display" }}>Why members choose us</h2>
            
            <div className="grid md:grid-cols-3 gap-12">
              {[
                { title: "Certified therapists", desc: "Every practitioner internationally certified and continually trained." },
                { title: "Absolute discretion", desc: "Private members-only sanctuary with encrypted booking and records." },
                { title: "Personalised rituals", desc: "Treatments tailored to your body, mood and season." },
                { title: "Concierge care", desc: "Direct WhatsApp line for Gold and Platinum members." },
                { title: "Zambian craft", desc: "Locally-sourced botanicals and homegrown expertise." },
                { title: "Consistent excellence", desc: "Every guest receives the same considered standard of care." }
              ].map((item, idx) => (
                <div key={idx}>
                  <h3 className="text-xl font-bold mb-3" style={{ fontFamily: "Playfair Display" }}>{item.title}</h3>
                  <p className="text-gray-700" style={{ fontFamily: "Lora" }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-16" style={{ fontFamily: "Playfair Display" }}>In their words</h2>
            
            <div className="max-w-3xl mx-auto">
              <div className="bg-gray-50 p-12 rounded-lg mb-8">
                <p className="text-xl mb-6" style={{ fontFamily: "Lora" }}>"{testimonials[currentTestimonial].text}"</p>
                <p className="font-bold text-lg">{testimonials[currentTestimonial].author.toUpperCase()} · {testimonials[currentTestimonial].location.toUpperCase()}</p>
              </div>
              
              <div className="flex items-center justify-between">
                <button onClick={prevTestimonial} className="p-2 hover:bg-gray-100 rounded-full transition">
                  <ChevronLeft className="w-6 h-6" />
                </button>
                
                <div className="flex gap-2">
                  {testimonials.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentTestimonial(idx)}
                      className={`w-3 h-3 rounded-full transition ${idx === currentTestimonial ? "bg-gray-900" : "bg-gray-300"}`}
                    />
                  ))}
                </div>
                
                <button onClick={nextTestimonial} className="p-2 hover:bg-gray-100 rounded-full transition">
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Membership */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <p className="text-xs tracking-widest text-gray-500 mb-4" style={{ fontFamily: "Playfair Display" }}>MEMBERSHIP</p>
              <h2 className="text-5xl font-bold" style={{ fontFamily: "Playfair Display" }}>Three ways to belong</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: "Silver",
                  tagline: "For wellness beginners",
                  price: "K800",
                  features: ["1 massage per month", "10% off additional services", "Priority booking", "Birthday special", "Access to member lounge"],
                  popular: false
                },
                {
                  name: "Gold",
                  tagline: "For regular enthusiasts",
                  price: "K1,600",
                  features: ["2 massages per month", "20% off all services", "VIP booking", "Free aromatherapy upgrade", "Quarterly wellness consult", "Guest privileges"],
                  popular: true
                },
                {
                  name: "Platinum",
                  tagline: "The exclusive experience",
                  price: "K3,200",
                  features: ["Unlimited massages", "30% off all services", "24/7 concierge", "Personal wellness plan", "Private therapy room", "Monthly spa day", "Home visit services"],
                  popular: false
                }
              ].map((plan, idx) => (
                <div key={idx} className={`relative ${plan.popular ? "md:scale-105" : ""}`}>
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gray-900 text-white px-4 py-1 rounded-full text-xs font-bold">MOST POPULAR</span>
                    </div>
                  )}
                  <Card className={`p-8 h-full ${plan.popular ? "border-2 border-gray-900" : "border-0"}`}>
                    <h3 className="text-3xl font-bold mb-2" style={{ fontFamily: "Playfair Display" }}>{plan.name}</h3>
                    <p className="text-gray-600 mb-6 text-sm">{plan.tagline}</p>
                    <div className="mb-8">
                      <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                      <span className="text-gray-600"> /month</span>
                    </div>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, fidx) => (
                        <li key={fidx} className="flex items-start gap-3">
                          <span className="text-gray-400">✦</span>
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-full">Enquire</Button>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-4xl font-bold text-center mb-16" style={{ fontFamily: "Playfair Display" }}>Questions, answered</h2>
            
            <div className="space-y-4">
              {faqItems.map((item, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === idx ? -1 : idx)}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition"
                  >
                    <h3 className="font-bold text-lg" style={{ fontFamily: "Playfair Display" }}>{item.question}</h3>
                    <ChevronRight className={`w-5 h-5 transition-transform ${expandedFaq === idx ? "rotate-90" : ""}`} />
                  </button>
                  {expandedFaq === idx && (
                    <div className="px-6 pb-6 text-gray-700 border-t border-gray-200" style={{ fontFamily: "Lora" }}>
                      {item.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-5xl font-bold mb-6" style={{ fontFamily: "Playfair Display" }}>Ready for your transformation?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto" style={{ fontFamily: "Lora" }}>
              Reserve your first ritual and discover why Tina's Sanctuary is Lusaka's most private wellness address.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-full px-8">
                Book Your Session
              </Button>
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10 rounded-full px-8">
                Meet Tina
              </Button>
            </div>
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
                  <li><a href="#" className="hover:text-white transition">Services</a></li>
                  <li><a href="#" className="hover:text-white transition">Therapists</a></li>
                  <li><a href="#" className="hover:text-white transition">Journal</a></li>
                  <li><a href="#" className="hover:text-white transition">About</a></li>
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
