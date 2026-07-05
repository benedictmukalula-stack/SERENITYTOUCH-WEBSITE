'use client';

import { useAppStore } from '@/lib/store';

const footerLinks = {
  explore: [
    { label: 'Home', page: 'home' as const },
    { label: 'Services', page: 'services' as const },
    { label: 'Therapists', page: 'therapists' as const },
    { label: 'Journal', page: 'blog' as const },
    { label: 'About', page: 'about' as const },
    { label: 'Contact', page: 'contact' as const },
  ],
  membership: [
    { label: 'Silver \u2014 K800/mo', page: 'membership' as const },
    { label: 'Gold \u2014 K1,600/mo', page: 'membership' as const },
    { label: 'Platinum \u2014 K3,200/mo', page: 'membership' as const },
  ],
};

export default function Footer() {
  const { navigate } = useAppStore();

  return (
    <footer className="bg-[#111827] text-gray-400 pt-16 pb-8">
      <div className="container-tinas">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <button
              onClick={() => navigate('home')}
              className="flex items-center gap-2.5 mb-4 cursor-pointer"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold to-pink-brand flex items-center justify-center text-white font-bold text-sm heading-display">
                TS
              </div>
              <span className="text-lg font-bold text-white heading-display tracking-tight">
                Tina&apos;s Sanctuary
              </span>
            </button>
            <p className="text-sm leading-relaxed">
              Exclusive wellness sanctuary in Lusaka, Zambia. Where certified therapists, silk-draped suites and considered rituals deliver the finest therapeutic experience.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Explore</h4>
            <ul className="space-y-2.5 text-sm">
              {footerLinks.explore.map((item) => (
                <li key={item.label}>
                  <button
                    onClick={() => navigate(item.page)}
                    className="hover:text-gold transition-colors cursor-pointer"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Membership */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Membership</h4>
            <ul className="space-y-2.5 text-sm">
              {footerLinks.membership.map((item) => (
                <li key={item.label}>
                  <button
                    onClick={() => navigate(item.page)}
                    className="hover:text-gold transition-colors cursor-pointer"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">Contact</h4>
            <ul className="space-y-2.5 text-sm">
              <li>183 Ibex Hill, Lusaka, Zambia</li>
              <li>
                <a href="tel:+260572782539" className="hover:text-gold transition-colors">
                  +260 572 782 539
                </a>
              </li>
              <li>
                <a href="mailto:info@tinassanctuary.zm" className="hover:text-gold transition-colors">
                  info@tinassanctuary.zm
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>&copy; 2026 Tina&apos;s Sanctuary. Crafted in Lusaka, Zambia.</p>
          <p>R18 &middot; Members must be 18 or older.</p>
        </div>
      </div>
    </footer>
  );
}