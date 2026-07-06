'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, User, Calendar } from 'lucide-react';
import { useAppStore } from '@/lib/store';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.06, duration: 0.5, ease: 'easeOut' },
  }),
};

const articles = [
  { id: 1, title: 'The Art of Self-Care: Building Your Wellness Treatment', excerpt: 'Discover how to create a personalized self-care routine that fits your lifestyle and wellness goals.', date: 'June 28, 2026', author: 'Taonga Phiri', category: 'Wellness', readTime: '5 min read', image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80', content: 'Self-care is not selfish — it is essential. In our fast-paced world, taking time for yourself is the foundation of good health. A wellness treatment is more than just a routine; it is a sacred practice that honours your body and mind...' },
  { id: 2, title: 'Deep Tissue Massage: More Than Just Relaxation', excerpt: 'Explore the therapeutic benefits of deep tissue massage beyond relaxation. From chronic pain relief to improved mobility.', date: 'June 21, 2026', author: 'Chipo Mwale', category: 'Treatments', readTime: '6 min read', image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=600&q=80', content: 'Deep tissue massage is often misunderstood as simply a more intense version of Swedish massage. In reality, it is a highly specialized therapeutic technique designed to address specific musculoskeletal issues...' },
  { id: 3, title: 'Aromatherapy Essentials: Oils for Every Season', excerpt: "Learn how to use essential oils throughout the year to support your wellness journey.", date: 'June 14, 2026', author: 'Patricia Nkomo', category: 'Aromatherapy', readTime: '7 min read', image: 'https://images.unsplash.com/photo-1611073615830-4ebed33c0e5b?w=600&q=80', content: 'The art of aromatherapy dates back thousands of years, and at Serenity Touch Spa, we honour this ancient practice by sourcing the finest essential oils and creating bespoke blends for each season...' },
  { id: 4, title: 'Stress Relief Through Reflexology', excerpt: 'Discover the ancient healing practice of reflexology and how it can help reduce stress and promote whole-body wellness.', date: 'June 7, 2026', author: 'Grace Banda', category: 'Wellness', readTime: '5 min read', image: 'https://images.unsplash.com/photo-1540555700478-4be289fbec6d?w=600&q=80', content: 'Reflexology is based on the principle that specific points on the feet and hands correspond to different organs and systems of the body.' },
  { id: 5, title: 'The Benefits of Regular Massage for Busy Professionals', excerpt: 'In our fast-paced world, regular massage is not a luxury — it is a necessity.', date: 'May 31, 2026', author: 'Taonga Phiri', category: 'Wellness', readTime: '6 min read', image: 'https://images.unsplash.com/photo-1517602436811-4ed606917e01?w=600&q=80', content: 'The modern professional faces unprecedented levels of stress. Long hours, screen time, and constant connectivity take a toll on both body and mind.' },
  { id: 6, title: 'Creating a Spa Experience at Home', excerpt: 'Extend the benefits of your spa visit by creating a wellness space at home.', date: 'May 24, 2026', author: 'Patricia Nkomo', category: 'Wellness', readTime: '5 min read', image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80', content: 'Your wellness journey does not end when you leave Serenity Touch Spa. With a few thoughtful touches, you can recreate the serenity of our treatment rooms in your own home...' },
];

const categories = ['All', 'Wellness', 'Treatments', 'Aromatherapy'];

export default function BlogPage() {
  const { navigate, activeBlogCategory, setActiveBlogCategory } = useAppStore();
  const [selectedArticle, setSelectedArticle] = useState<number | null>(null);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const filteredArticles = activeBlogCategory === 'All' ? articles : articles.filter((a) => a.category === activeBlogCategory);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) { setSubscribed(true); setEmail(''); setTimeout(() => setSubscribed(false), 3000); }
  };

  const selected = selectedArticle !== null ? articles.find((a) => a.id === selectedArticle) : null;

  if (selected) {
    return (
      <div className="min-h-screen">
        <section className="pt-32 pb-8 section-dark">
          <div className="container-tinas">
            <button onClick={() => setSelectedArticle(null)} className="text-sm text-pink-glow/35 hover:text-white transition cursor-pointer mb-6 inline-flex items-center gap-1">← Back to Blog</button>
          </div>
        </section>
        <section className="pb-20 surface-base">
          <div className="container-tinas max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-xs font-semibold text-pink-brand uppercase tracking-wider">{selected.category}</span>
                <span className="text-gold/40">·</span>
                <span className="text-xs text-gold/50">{selected.readTime}</span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 heading-display leading-tight">{selected.title}</h1>
              <div className="flex items-center gap-5 text-sm text-pink-glow/35 mb-10">
                <div className="flex items-center gap-1.5"><User className="w-3.5 h-3.5" /><span>{selected.author}</span></div>
                <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /><span>{selected.date}</span></div>
              </div>
              <div className="rounded-2xl overflow-hidden mb-10">
                <img src={selected.image} alt={selected.title} className="w-full h-[300px] md:h-[400px] object-cover" />
              </div>
              <div className="space-y-5 text-pink-glow/45 body-serif font-light leading-relaxed text-[16px]">
                <p>{selected.excerpt}</p>
                <p>{selected.content}</p>
                <p>At Serenity Touch Spa, we believe that knowledge is a crucial part of wellness. Understanding the treatments and practices you receive empowers you to make informed decisions about your health. We encourage all our guests to explore, ask questions, and take an active role in their wellness journey.</p>
                <p>Whether you are a seasoned wellness enthusiast or just beginning to explore the world of therapeutic care, our journal is here to support and inspire you. Each article is written by our team of certified therapists and wellness experts, drawing on years of experience and a deep passion for their craft.</p>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      <section className="pt-32 pb-16 section-dark">
        <div className="container-tinas text-center">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 heading-display">Wellness Journal</motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="text-lg text-pink-glow/35 max-w-2xl mx-auto body-serif font-light">Insights, tips, and inspiration for your wellness journey.</motion.p>
        </div>
      </section>

      <section className="section-padding surface-base">
        <div className="container-tinas">
          <div className="flex justify-center gap-3 mb-14 flex-wrap">
            {categories.map((cat) => (
              <button key={cat} onClick={() => setActiveBlogCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${activeBlogCategory === cat ? 'bg-gold text-black font-semibold' : 'bg-gold/8 text-pink-glow/35 hover:bg-white/10 border border-gold/12'}`}>
                {cat}
              </button>
            ))}
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredArticles.map((article, idx) => (
              <motion.div key={article.id} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-30px' }} variants={fadeUp} custom={idx}>
                <div onClick={() => setSelectedArticle(article.id)} className="group surface-raised rounded-2xl overflow-hidden hover:border-pink-brand/30 transition-all duration-300 cursor-pointer h-full flex flex-col">
                  <div className="h-48 overflow-hidden relative">
                    <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-3 left-3"><span className="bg-black/60 backdrop-blur-sm text-pink-brand border border-gold/20 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">{article.category}</span></div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-lg font-bold mb-3 heading-display group-hover:text-white transition-colors line-clamp-2">{article.title}</h3>
                    <p className="text-pink-glow/35 mb-4 text-sm body-serif font-light leading-relaxed line-clamp-3 flex-1">{article.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-gold/50 pt-4 border-t border-gold/8">
                      <span className="flex items-center gap-1"><User className="w-3 h-3" /> {article.author}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {article.readTime}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding section-dark">
        <div className="container-tinas max-w-2xl text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl md:text-4xl font-bold mb-4 heading-display">Stay Inspired</motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-pink-glow/35 mb-8 body-serif font-light">Subscribe to our wellness journal for monthly insights and exclusive tips.</motion.p>
            <motion.form variants={fadeUp} custom={2} onSubmit={handleSubscribe} className="flex gap-3 max-w-md mx-auto">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required
                className="flex-1 px-5 py-3 rounded-full border border-gold/15 bg-gold/8 focus:outline-none focus:border-pink-brand text-sm body-serif font-light text-white placeholder:text-gold/30 transition" />
              <button type="submit" className="btn-pink px-7 py-3 text-sm cursor-pointer shrink-0">{subscribed ? 'Subscribed!' : 'Subscribe'}</button>
            </motion.form>
          </motion.div>
        </div>
      </section>

      <section className="section-padding section-dark">
        <div className="container-tinas text-center">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={0} className="text-4xl md:text-5xl font-bold mb-6 heading-display">Ready to experience wellness?</motion.h2>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={1} className="text-lg mb-8 max-w-2xl mx-auto body-serif font-light text-pink-glow/35 leading-relaxed">Book your first session and discover the spa that inspires your wellness journey.</motion.p>
          <motion.button initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} custom={2} onClick={() => navigate('contact')} className="btn-outline-pink px-8 py-3.5 text-sm font-semibold cursor-pointer">Book Your Session</motion.button>
        </div>
      </section>
    </div>
  );
}