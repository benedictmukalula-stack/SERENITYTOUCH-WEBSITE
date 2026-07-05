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
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-black font-bold text-sm heading-display" style={{ background: 'linear-gradient(135deg, #D4AF37 0%, #E91E63 100%)' }}>TS</div>
              <span className="text-lg font-semibold text-white heading-display tracking-tight">Tina&apos;s Sanctuary</span>
            </button>
            <p className="text-sm text-gold/40 leading-relaxed">Exclusive wellness sanctuary in Lusaka, Zambia. Where certified therapists deliver the finest therapeutic experience.</p>
          </div>
          <div>
            <h4 className="text-gold font-semibold text-sm tracking-wider uppercase mb-4">Explore</h4>
            <ul className="space-y-2.5 text-sm">
              {(['Home', 'Services', 'Therapists', 'Journal', 'About', 'Contact'] as const).map((item) => (
                <li key={item}><button onClick={() => navigate(item.toLowerCase() as 'home' | 'services' | 'therapists' | 'blog' | 'about' | 'contact')} className="text-gold/35 hover:text-gold transition-colors cursor-pointer">{item}</button></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-gold font-semibold text-sm tracking-wider uppercase mb-4">Membership</h4>
            <ul className="space-y-2.5 text-sm text-gold/35">
              <li><button onClick={() => navigate('membership')} className="hover:text-gold transition-colors cursor-pointer">Silver — K800/mo</button></li>
              <li><button onClick={() => navigate('membership')} className="hover:text-gold transition-colors cursor-pointer">Gold — K1,600/mo</button></li>
              <li><button onClick={() => navigate('membership')} className="hover:text-gold transition-colors cursor-pointer">Platinum — K3,200/mo</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-gold font-semibold text-sm tracking-wider uppercase mb-4">Contact</h4>
            <ul className="space-y-2.5 text-sm text-gold/35">
              <li>183 Ibex Hill, Lusaka, Zambia</li>
              <li><a href="tel:+260572782539" className="hover:text-gold transition-colors">+260 572 782 539</a></li>
              <li><a href="mailto:info@tinassanctuary.zm" className="hover:text-gold transition-colors">info@tinassanctuary.zm</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gold/8 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-gold/30 gap-4">
          <p>&copy; 2026 Tina&apos;s Sanctuary. Crafted in Lusaka, Zambia.</p>
          <p>R18 &middot; Members must be 18 or older.</p>
        </div>
      </div>
    </footer>
  );
}