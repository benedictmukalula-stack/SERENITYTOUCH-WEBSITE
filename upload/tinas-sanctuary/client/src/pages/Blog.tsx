import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";

export default function Blog() {
  const articles = [
    {
      id: 1,
      title: "The Art of Self-Care: Building Your Wellness Ritual",
      excerpt: "Discover how to create a personalized self-care routine that fits your lifestyle and wellness goals. Learn the science behind why rituals matter for your mental and physical health.",
      date: "June 28, 2026",
      author: "Tina Mulenga",
      category: "Wellness",
      readTime: "5 min read",
      image: "/manus-storage/wellness-ritual_6db18ac4.jpg"
    },
    {
      id: 2,
      title: "Deep Tissue Massage: More Than Just Relaxation",
      excerpt: "Explore the therapeutic benefits of deep tissue massage beyond relaxation. From chronic pain relief to improved mobility, understand how this technique supports your overall wellness.",
      date: "June 21, 2026",
      author: "Chipo Mwale",
      category: "Treatments",
      readTime: "6 min read",
      image: "/manus-storage/wellness-ritual_6db18ac4.jpg"
    },
    {
      id: 3,
      title: "Aromatherapy Essentials: Oils for Every Season",
      excerpt: "Learn how to use essential oils throughout the year to support your wellness journey. Patricia shares her favorite seasonal blends and their therapeutic properties.",
      date: "June 14, 2026",
      author: "Patricia Nkomo",
      category: "Aromatherapy",
      readTime: "7 min read",
      image: "/manus-storage/wellness-ritual_6db18ac4.jpg"
    },
    {
      id: 4,
      title: "Stress Relief Through Reflexology",
      excerpt: "Discover the ancient healing practice of reflexology and how it can help reduce stress and promote whole-body wellness. Learn the key reflex points and their benefits.",
      date: "June 7, 2026",
      author: "Grace Banda",
      category: "Wellness",
      readTime: "5 min read",
      image: "/manus-storage/wellness-ritual_6db18ac4.jpg"
    },
    {
      id: 5,
      title: "The Benefits of Regular Massage for Busy Professionals",
      excerpt: "In our fast-paced world, regular massage isn't a luxury—it's a necessity. Explore how consistent therapeutic care can improve productivity and quality of life.",
      date: "May 31, 2026",
      author: "Tina Mulenga",
      category: "Wellness",
      readTime: "6 min read",
      image: "/manus-storage/wellness-ritual_6db18ac4.jpg"
    },
    {
      id: 6,
      title: "Creating a Spa Experience at Home",
      excerpt: "Extend the benefits of your sanctuary visit by creating a wellness space at home. Learn simple techniques to bring the luxury and relaxation of our treatments into your daily life.",
      date: "May 24, 2026",
      author: "Patricia Nkomo",
      category: "Wellness",
      readTime: "5 min read",
      image: "/manus-storage/wellness-ritual_6db18ac4.jpg"
    }
  ];

  const categories = ["All", "Wellness", "Treatments", "Aromatherapy"];

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
            <a href="#blog" className="text-sm text-gray-700 hover:text-gray-900 transition font-semibold">Journal</a>
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
          <h1 className="text-5xl md:text-6xl font-bold mb-6" style={{ fontFamily: "Playfair Display" }}>Wellness Journal</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto" style={{ fontFamily: "Lora" }}>
            Insights, tips, and inspiration for your wellness journey. Explore articles from our therapists and wellness experts.
          </p>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          {/* Category Filter */}
          <div className="flex justify-center gap-4 mb-16 flex-wrap">
            {categories.map((category) => (
              <button
                key={category}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition ${
                  category === "All"
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Articles Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <Card key={article.id} className="overflow-hidden border-0 shadow-sm hover:shadow-lg transition cursor-pointer">
                <div className="h-48 bg-gray-200 overflow-hidden">
                  <img src={article.image} alt={article.title} className="w-full h-full object-cover hover:scale-105 transition duration-300" />
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-pink-500 uppercase">{article.category}</span>
                    <span className="text-xs text-gray-500">{article.readTime}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900" style={{ fontFamily: "Playfair Display" }}>
                    {article.title}
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm" style={{ fontFamily: "Lora" }}>
                    {article.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{article.author}</span>
                    <span>{article.date}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-2xl text-center">
          <h2 className="text-4xl font-bold mb-6" style={{ fontFamily: "Playfair Display" }}>Stay Inspired</h2>
          <p className="text-gray-600 mb-8" style={{ fontFamily: "Lora" }}>
            Subscribe to our wellness journal for monthly insights, exclusive tips, and sanctuary updates delivered to your inbox.
          </p>
          <div className="flex gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 rounded-full border border-gray-300 focus:outline-none focus:border-gray-900"
            />
            <Button className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-8">Subscribe</Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold mb-6" style={{ fontFamily: "Playfair Display" }}>Ready to experience wellness?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto" style={{ fontFamily: "Lora" }}>
            Book your first session and discover the sanctuary that inspires your wellness journey.
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
