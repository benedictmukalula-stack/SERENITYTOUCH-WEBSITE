import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Crown, Zap, Heart } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";

export default function Membership() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedTier, setSelectedTier] = useState<"silver" | "gold" | "platinum" | null>(null);
  const [loading, setLoading] = useState(false);

  const createCheckoutMutation = trpc.payment.createCheckoutSession.useMutation();

  const membershipTiers = [
    {
      id: "silver",
      name: "Silver",
      tagline: "For wellness beginners",
      price: 800,
      icon: Heart,
      features: [
        "1 massage per month",
        "10% off additional services",
        "Priority booking",
        "Birthday special",
        "Access to member lounge",
      ],
      popular: false,
    },
    {
      id: "gold",
      name: "Gold",
      tagline: "For regular enthusiasts",
      price: 1600,
      icon: Zap,
      features: [
        "2 massages per month",
        "20% off all services",
        "VIP booking",
        "Free aromatherapy upgrade",
        "Quarterly wellness consult",
        "Guest privileges",
      ],
      popular: true,
    },
    {
      id: "platinum",
      name: "Platinum",
      tagline: "The exclusive experience",
      price: 3200,
      icon: Crown,
      features: [
        "Unlimited massages",
        "30% off all services",
        "24/7 concierge",
        "Personal wellness plan",
        "Private therapy room",
        "Monthly spa day",
        "Home visit services",
      ],
      popular: false,
    },
  ];

  const handleUpgrade = async (tier: "silver" | "gold" | "platinum") => {
    if (!user) {
      setLocation("/auth");
      return;
    }

    setLoading(true);
    setSelectedTier(tier);

    try {
      const result = await createCheckoutMutation.mutateAsync({
        membershipTier: tier,
        successUrl: `${window.location.origin}/member-portal?success=true`,
        cancelUrl: `${window.location.origin}/membership`,
      });

      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      alert("Failed to initiate payment. Please try again.");
    } finally {
      setLoading(false);
      setSelectedTier(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-32 pb-20">
      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a] border-b border-[rgba(212,165,116,0.2)]">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-[#D4A574]" style={{ fontFamily: "Playfair Display" }}>
              Tina's Sanctuary
            </span>
          </div>
          <Button className="bg-[#E91E63] hover:bg-[#c2185b] text-white rounded-full px-6">
            Sign in
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-4">
        {/* Page Title */}
        <div className="text-center mb-20">
          <p className="text-xs tracking-widest text-[#D4A574] mb-4" style={{ fontFamily: "Playfair Display" }}>
            MEMBERSHIP PLANS
          </p>
          <h1 className="text-5xl md:text-6xl font-bold mb-6" style={{ fontFamily: "Playfair Display" }}>
            Choose Your Path to Wellness
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto" style={{ fontFamily: "Lora" }}>
            Select the membership tier that best suits your wellness journey. All memberships include access to our private sanctuary and certified therapists.
          </p>
        </div>

        {/* Membership Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {membershipTiers.map((tier) => {
            const Icon = tier.icon;
            return (
              <div key={tier.id} className={`relative ${tier.popular ? "md:scale-105" : ""}`}>
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <span className="bg-[#E91E63] text-white px-4 py-1 rounded-full text-xs font-bold">
                      MOST POPULAR
                    </span>
                  </div>
                )}
                <Card
                  className={`p-8 h-full bg-[#1a1a1a] border ${
                    tier.popular
                      ? "border-[#E91E63] shadow-lg shadow-[#E91E63]/20"
                      : "border-[rgba(212,165,116,0.3)]"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Icon className="w-8 h-8 text-[#D4A574]" />
                    <h3 className="text-3xl font-bold" style={{ fontFamily: "Playfair Display" }}>
                      {tier.name}
                    </h3>
                  </div>
                  <p className="text-gray-400 mb-6 text-sm">{tier.tagline}</p>
                  <div className="mb-8">
                    <span className="text-4xl font-bold text-white">K{tier.price}</span>
                    <span className="text-gray-400"> /month</span>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-[#BFFF00] flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={() => handleUpgrade(tier.id as "silver" | "gold" | "platinum")}
                    disabled={loading && selectedTier === tier.id}
                    className={`w-full rounded-full font-semibold py-3 ${
                      tier.popular
                        ? "bg-[#E91E63] hover:bg-[#c2185b] text-white"
                        : "bg-transparent border-2 border-[#D4A574] text-[#D4A574] hover:bg-[rgba(212,165,116,0.1)]"
                    }`}
                  >
                    {loading && selectedTier === tier.id ? "Processing..." : "Upgrade Now"}
                  </Button>
                </Card>
              </div>
            );
          })}
        </div>

        {/* Comparison Table */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12" style={{ fontFamily: "Playfair Display" }}>
            Detailed Comparison
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[rgba(212,165,116,0.2)]">
                  <th className="text-left py-4 px-4 text-[#D4A574]">Feature</th>
                  <th className="text-center py-4 px-4 text-[#D4A574]">Silver</th>
                  <th className="text-center py-4 px-4 text-[#D4A574]">Gold</th>
                  <th className="text-center py-4 px-4 text-[#D4A574]">Platinum</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: "Monthly Sessions", silver: "1", gold: "2", platinum: "Unlimited" },
                  { feature: "Service Discount", silver: "10%", gold: "20%", platinum: "30%" },
                  { feature: "Priority Booking", silver: "Yes", gold: "Yes", platinum: "Yes" },
                  { feature: "Concierge Service", silver: "No", gold: "No", platinum: "24/7" },
                  { feature: "Personal Wellness Plan", silver: "No", gold: "No", platinum: "Yes" },
                  { feature: "Home Visit Services", silver: "No", gold: "No", platinum: "Yes" },
                ].map((row, idx) => (
                  <tr key={idx} className="border-b border-[rgba(212,165,116,0.1)]">
                    <td className="py-4 px-4 text-gray-300">{row.feature}</td>
                    <td className="py-4 px-4 text-center text-gray-300">{row.silver}</td>
                    <td className="py-4 px-4 text-center text-gray-300">{row.gold}</td>
                    <td className="py-4 px-4 text-center text-[#BFFF00]">{row.platinum}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12" style={{ fontFamily: "Playfair Display" }}>
            Membership FAQs
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "Can I change my membership tier?",
                a: "Yes, you can upgrade or downgrade your membership at any time. Changes take effect on your next billing cycle.",
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards (Visa, Mastercard, American Express) through our secure Stripe payment system.",
              },
              {
                q: "Is there a cancellation fee?",
                a: "No cancellation fees. You can cancel your membership anytime with no penalties. Your access continues until the end of your billing period.",
              },
              {
                q: "Do unused sessions roll over?",
                a: "Sessions do not roll over to the next month. However, Platinum members have unlimited sessions, so there's no limit.",
              },
            ].map((item, idx) => (
              <div key={idx} className="bg-[#1a1a1a] border border-[rgba(212,165,116,0.3)] rounded-lg p-6">
                <h3 className="font-bold text-lg mb-2 text-[#D4A574]">{item.q}</h3>
                <p className="text-gray-300 text-sm">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#0a0a0a] text-gray-300 py-16 mt-32 border-t border-[rgba(212,165,116,0.2)]">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <h3 className="text-white font-bold text-lg mb-4" style={{ fontFamily: "Playfair Display" }}>
                Tina's Sanctuary
              </h3>
              <p className="text-sm">Exclusive wellness sanctuary in Lusaka, Zambia</p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/" className="hover:text-[#D4A574]">Home</a></li>
                <li><a href="/services" className="hover:text-[#D4A574]">Services</a></li>
                <li><a href="/contact" className="hover:text-[#D4A574]">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li>183 Ibex Hill, Lusaka</li>
                <li><a href="tel:+260572782539" className="hover:text-[#D4A574]">+260 572 782 539</a></li>
                <li><a href="mailto:info@tinassanctuary.zm" className="hover:text-[#D4A574]">info@tinassanctuary.zm</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Follow Us</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-[#D4A574]">Instagram</a></li>
                <li><a href="#" className="hover:text-[#D4A574]">WhatsApp</a></li>
                <li><a href="#" className="hover:text-[#D4A574]">Facebook</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[rgba(212,165,116,0.2)] pt-8 text-center text-sm">
            <p>© 2026 Tina's Sanctuary. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
