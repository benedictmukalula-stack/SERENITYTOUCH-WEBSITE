'use client';

import { useAppStore } from '@/lib/store';

export default function Footer() {
  const { navigate } = useAppStore();

  return (
    <footer style={{ background: '#000000' }} className="border-t border-gold/8 pt-16 pb-8">
      <div className="container-tinas">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          <div className="col-span-2 md:col-span-1">
            <button onClick={() => navigate('home')} className="flex items-center gap-2.5 mb-4 cursor-pointer">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-black font-bold text-sm heading-display" style={{ background: 'linear-gradient(135deg, #D4AF37 0%, #E91E63 100%)' }}>ST</div>
              <span className="text-lg font-semibold text-white heading-display tracking-tight">Serenity Touch Spa</span>
            </button>
            <p className="text-sm text-gold/40 leading-relaxed mb-4">Premium wellness spa in Lusaka, Zambia. Relax, Restore, Rejuvenate.</p>
            <div className="space-y-1.5 text-xs text-gold/35">
              <p>WhatsApp: <a href="https://wa.me/260761404555" className="hover:text-gold transition-colors">+260 761 404 555</a></p>
              <p>Phone: <a href="tel:+260572782539" className="hover:text-gold transition-colors">+260 572 782 539</a></p>
            </div>
          </div>
          <div>
            <h4 className="text-gold font-semibold text-sm tracking-wider uppercase mb-4">Explore</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: 'Home', page: 'home' },
                { label: 'Treatments', page: 'services' },
                { label: 'Packages', page: 'packages' },
                { label: 'Membership', page: 'membership' },
                { label: 'Gallery', page: 'gallery' },
                { label: 'Contact', page: 'contact' },
              ].map((item) => (
                <li key={item.page}><button onClick={() => navigate(item.page as any)} className="text-gold/35 hover:text-gold transition-colors cursor-pointer">{item.label}</button></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-gold font-semibold text-sm tracking-wider uppercase mb-4">More</h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: 'Corporate Wellness', page: 'corporate' },
                { label: 'Gift Vouchers', page: 'vouchers' },
                { label: 'Testimonials', page: 'testimonials' },
                { label: 'Blog', page: 'blog' },
                { label: 'About Us', page: 'about' },
              ].map((item) => (
                <li key={item.page}><button onClick={() => navigate(item.page as any)} className="text-gold/35 hover:text-gold transition-colors cursor-pointer">{item.label}</button></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-gold font-semibold text-sm tracking-wider uppercase mb-4">Contact</h4>
            <ul className="space-y-2.5 text-sm text-gold/35">
              <li>183 Ibex Hill, Lusaka, Zambia</li>
              <li><a href="tel:+260572782539" className="hover:text-gold transition-colors">+260 572 782 539</a></li>
              <li><a href="https://wa.me/260761404555" className="hover:text-gold transition-colors">WhatsApp: +260 761 404 555</a></li>
              <li><a href="mailto:info@serenitytouch.co.zm" className="hover:text-gold transition-colors">info@serenitytouch.co.zm</a></li>
              <li><a href="mailto:info@serenitytouch.co.za" className="hover:text-gold transition-colors">info@serenitytouch.co.za</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gold/8 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-gold/30 gap-4">
          <p>&copy; 2026 Serenity Touch Spa. All rights reserved.</p>
          <p>www.serenitytouch.co.zm</p>
        </div>
      </div>
    </footer>
  );
}