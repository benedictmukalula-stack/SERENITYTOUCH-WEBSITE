'use client';

import { useAppStore } from '@/lib/store';

export default function Footer() {
  const { navigate } = useAppStore();

  return (
    <footer style={{ background: '#0a0a0a' }} className="border-t border-gold/15 pt-16 pb-8">
      <div className="container-tinas">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          <div className="col-span-2 md:col-span-1">
            <button onClick={() => navigate('home')} className="flex items-center gap-2.5 mb-4 cursor-pointer">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold to-pink-brand flex items-center justify-center text-[#0a0a0a] font-bold text-sm heading-display">TS</div>
              <span className="text-lg font-bold text-white heading-display tracking-tight">Tina&apos;s Sanctuary</span>
            </button>
            <p className="text-sm text-gray-500 leading-relaxed">Exclusive wellness sanctuary in Lusaka, Zambia. Where certified therapists deliver the finest therapeutic experience.</p>
          </div>
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Explore</h4>
            <ul className="space-y-2.5 text-sm">
              {(['Home', 'Services', 'Therapists', 'Journal', 'About', 'Contact'] as const).map((item) => (
                <li key={item}><button onClick={() => navigate(item.toLowerCase() as 'home' | 'services' | 'therapists' | 'blog' | 'about' | 'contact')} className="text-gray-500 hover:text-gold transition-colors cursor-pointer">{item}</button></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Membership</h4>
            <ul className="space-y-2.5 text-sm text-gray-500">
              <li><button onClick={() => navigate('membership')} className="hover:text-gold transition-colors cursor-pointer">Silver — K800/mo</button></li>
              <li><button onClick={() => navigate('membership')} className="hover:text-gold transition-colors cursor-pointer">Gold — K1,600/mo</button></li>
              <li><button onClick={() => navigate('membership')} className="hover:text-gold transition-colors cursor-pointer">Platinum — K3,200/mo</button></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Contact</h4>
            <ul className="space-y-2.5 text-sm text-gray-500">
              <li>183 Ibex Hill, Lusaka, Zambia</li>
              <li><a href="tel:+260572782539" className="hover:text-gold transition-colors">+260 572 782 539</a></li>
              <li><a href="mailto:info@tinassanctuary.zm" className="hover:text-gold transition-colors">info@tinassanctuary.zm</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gold/10 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-gray-600 gap-4">
          <p>&copy; 2026 Tina&apos;s Sanctuary. Crafted in Lusaka, Zambia.</p>
          <p>R18 &middot; Members must be 18 or older.</p>
        </div>
      </div>
    </footer>
  );
}