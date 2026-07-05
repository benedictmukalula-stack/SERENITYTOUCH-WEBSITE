import { Button } from "@/components/ui/button";
  import { Card } from "@/components/ui/card";
  import { Link } from "wouter";
  import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function Contact() {
  const { isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    date: "",
    time: "",
    message: ""
  });

  const bookingMutation = trpc.booking.create.useMutation({
    onSuccess: () => {
      toast.success("Booking request submitted! We'll confirm shortly.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        service: "",
        date: "",
        time: "",
        message: "",
      });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to submit booking");
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }

    if (!formData.date || !formData.time || !formData.service) {
      toast.error("Please fill in all required fields");
      return;
    }

    const bookingDate = new Date(`${formData.date}T${formData.time}`);
    
    bookingMutation.mutate({
      serviceType: formData.service,
      bookingDate,
      duration: 60,
      notes: formData.message,
    });
  };

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
            <Link href="/about">
              <a className="text-sm text-gray-700 hover:text-gray-900 transition">About</a>
            </Link>
            <a href="#contact" className="text-sm text-gray-700 hover:text-gray-900 transition font-semibold">Contact</a>
            <Button className="text-sm bg-pink-500 text-white border-0 hover:bg-pink-600 rounded-full px-6">Sign in</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6" style={{ fontFamily: "Playfair Display" }}>Get in Touch</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto" style={{ fontFamily: "Lora" }}>
            Ready to begin your wellness journey? Contact us to book your first session or inquire about our services.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12 mb-16">
            {/* Contact Info */}
            <div className="md:col-span-1">
              <h2 className="text-2xl font-bold mb-8" style={{ fontFamily: "Playfair Display" }}>Contact Information</h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Address</h3>
                  <p className="text-gray-600">183 Ibex Hill, Lusaka, Zambia</p>
                </div>
                
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Phone</h3>
                  <a href="tel:+260572782539" className="text-pink-500 hover:text-pink-600 transition">
                    +260 572 782 539
                  </a>
                </div>
                
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Email</h3>
                  <a href="mailto:info@tinassanctuary.zm" className="text-pink-500 hover:text-pink-600 transition">
                    info@tinassanctuary.zm
                  </a>
                </div>
                
                <div>
                  <h3 className="font-bold text-gray-900 mb-4">Hours</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p>Saturday: 10:00 AM - 5:00 PM</p>
                    <p>Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Form */}
            <div className="md:col-span-2">
              <Card className="p-8 border-0 shadow-sm">
                <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: "Playfair Display" }}>Book Your Session</h2>
                
                {bookingMutation.isSuccess ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                    <p className="text-green-800 font-semibold mb-2">Thank you for your inquiry!</p>
                    <p className="text-green-700 text-sm">We'll contact you shortly to confirm your booking.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Full Name</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Phone</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900"
                          placeholder="+260 XXX XXX XXX"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">Preferred Date</label>
                        <input
                          type="date"
                          name="date"
                          value={formData.date}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Service</label>
                      <select
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900"
                      >
                        <option value="">Select a service</option>
                        <option value="swedish">Swedish Massage (60 min) - K800</option>
                        <option value="deeptissue">Deep Tissue Massage (90 min) - K1,200</option>
                        <option value="hotstone">Hot Stone Therapy (75 min) - K1,000</option>
                        <option value="aromatherapy">Aromatherapy Treatment (60 min) - K900</option>
                        <option value="couples">Couples Massage (90 min) - K2,000</option>
                        <option value="reflexology">Reflexology (60 min) - K850</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">Additional Notes</label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-900"
                        placeholder="Any special requests or preferences?"
                      />
                    </div>

                    <Button type="submit" size="lg" className="w-full bg-gray-900 hover:bg-gray-800 text-white rounded-full">
                      Request Booking
                    </Button>
                  </form>
                )}
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-4xl font-bold text-center mb-12" style={{ fontFamily: "Playfair Display" }}>Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <Card className="p-6 border-0">
              <h3 className="font-bold text-lg mb-2">How do I book an appointment?</h3>
              <p className="text-gray-600">You can book through this form, call us at +260 572 782 539, or email info@tinassanctuary.zm. Members can also use our WhatsApp concierge line for priority booking.</p>
            </Card>
            
            <Card className="p-6 border-0">
              <h3 className="font-bold text-lg mb-2">What is your cancellation policy?</h3>
              <p className="text-gray-600">Cancellations made 24 hours in advance receive a full refund. Cancellations within 24 hours are subject to a 50% fee. No-shows will be charged in full.</p>
            </Card>
            
            <Card className="p-6 border-0">
              <h3 className="font-bold text-lg mb-2">Do you offer membership plans?</h3>
              <p className="text-gray-600">Yes! We offer three membership tiers: Silver (K800/mo), Gold (K1,600/mo), and Platinum (K3,200/mo). Each includes different benefits and service inclusions.</p>
            </Card>
            
            <Card className="p-6 border-0">
              <h3 className="font-bold text-lg mb-2">Are your therapists certified?</h3>
              <p className="text-gray-600">Yes, every therapist at Tina's Sanctuary is internationally certified and continually trained in the latest therapeutic techniques.</p>
            </Card>
            
            <Card className="p-6 border-0">
              <h3 className="font-bold text-lg mb-2">What should I bring to my appointment?</h3>
              <p className="text-gray-600">Just bring yourself! We provide all linens, oils, and amenities. Arrive 10 minutes early to complete a brief wellness consultation.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold mb-6" style={{ fontFamily: "Playfair Display" }}>We look forward to welcoming you</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto" style={{ fontFamily: "Lora" }}>
            Experience the transformation that awaits you at Tina's Sanctuary.
          </p>
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
