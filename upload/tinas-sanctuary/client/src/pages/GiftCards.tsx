import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Gift, Copy, CheckCircle } from "lucide-react";

export default function GiftCards() {
  const [activeTab, setActiveTab] = useState<"purchase" | "redeem" | "manage">("purchase");
  const [amount, setAmount] = useState("1000");
  const [recipientName, setRecipientName] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [message, setMessage] = useState("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const myGiftCards = [
    { code: "TINA-ABC123XYZ456", amount: 2000, status: "unused", createdAt: "2026-06-15", expiresAt: "2027-06-15" },
    { code: "TINA-DEF789GHI012", amount: 1500, status: "unused", createdAt: "2026-06-10", expiresAt: "2027-06-10" },
    { code: "TINA-JKL345MNO678", amount: 5000, status: "redeemed", createdAt: "2026-05-20", expiresAt: "2027-05-20" },
  ];

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-[#D4A574] mb-2" style={{ fontFamily: "Playfair Display" }}>
            Gift Cards
          </h1>
          <p className="text-gray-400">Share the gift of wellness with friends and family</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-[rgba(212,165,116,0.2)]">
          {(["purchase", "redeem", "manage"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-semibold transition capitalize ${
                activeTab === tab
                  ? "text-[#D4A574] border-b-2 border-[#D4A574]"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Purchase Tab */}
        {activeTab === "purchase" && (
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 bg-[#1a1a1a] border border-[rgba(212,165,116,0.3)]">
              <h3 className="text-2xl font-bold text-[#D4A574] mb-6" style={{ fontFamily: "Playfair Display" }}>
                Create Gift Card
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Amount (Kwacha)</label>
                  <div className="grid grid-cols-4 gap-2">
                    {["500", "1000", "2000", "5000"].map((val) => (
                      <button
                        key={val}
                        onClick={() => setAmount(val)}
                        className={`py-2 rounded-lg font-semibold transition ${
                          amount === val
                            ? "bg-[#E91E63] text-white"
                            : "bg-[#0a0a0a] text-gray-300 border border-[rgba(212,165,116,0.3)] hover:border-[#E91E63]"
                        }`}
                      >
                        K{val}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Recipient Name</label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="Enter recipient name"
                    className="w-full px-4 py-2 bg-[#0a0a0a] border border-[rgba(212,165,116,0.3)] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#E91E63]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Recipient Email</label>
                  <input
                    type="email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    placeholder="Enter recipient email"
                    className="w-full px-4 py-2 bg-[#0a0a0a] border border-[rgba(212,165,116,0.3)] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#E91E63]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">Personal Message (Optional)</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Add a personal message"
                    rows={3}
                    className="w-full px-4 py-2 bg-[#0a0a0a] border border-[rgba(212,165,116,0.3)] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#E91E63]"
                  />
                </div>

                <button className="w-full px-6 py-3 bg-[#E91E63] hover:bg-[#c2185b] text-white rounded-lg font-bold transition flex items-center justify-center gap-2">
                  <Gift className="w-5 h-5" />
                  Purchase Gift Card
                </button>
              </div>
            </Card>

            <Card className="p-8 bg-[#1a1a1a] border border-[rgba(212,165,116,0.3)]">
              <h3 className="text-2xl font-bold text-[#D4A574] mb-6" style={{ fontFamily: "Playfair Display" }}>
                Order Summary
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between pb-4 border-b border-[rgba(212,165,116,0.2)]">
                  <span className="text-gray-400">Gift Card Amount</span>
                  <span className="text-white font-bold">K{amount}</span>
                </div>

                <div className="flex justify-between pb-4 border-b border-[rgba(212,165,116,0.2)]">
                  <span className="text-gray-400">Processing Fee</span>
                  <span className="text-white font-bold">K0</span>
                </div>

                <div className="flex justify-between pt-4">
                  <span className="text-lg font-bold text-[#D4A574]">Total</span>
                  <span className="text-2xl font-bold text-[#E91E63]">K{amount}</span>
                </div>

                <div className="mt-8 p-4 bg-[#BFFF00]/10 border border-[#BFFF00] rounded-lg">
                  <p className="text-[#BFFF00] text-sm">✓ Gift cards never expire and can be used for any service at Tina's Sanctuary</p>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* Redeem Tab */}
        {activeTab === "redeem" && (
          <Card className="p-8 bg-[#1a1a1a] border border-[rgba(212,165,116,0.3)] max-w-2xl">
            <h3 className="text-2xl font-bold text-[#D4A574] mb-6" style={{ fontFamily: "Playfair Display" }}>
              Redeem Gift Card
            </h3>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Gift Card Code</label>
                <input
                  type="text"
                  placeholder="Enter your gift card code (e.g., TINA-ABC123XYZ456)"
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-[rgba(212,165,116,0.3)] rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#E91E63] font-mono text-lg"
                />
              </div>

              <button className="w-full px-6 py-3 bg-[#E91E63] hover:bg-[#c2185b] text-white rounded-lg font-bold transition flex items-center justify-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Redeem Now
              </button>

              <div className="p-4 bg-blue-500/10 border border-blue-500 rounded-lg">
                <p className="text-blue-400 text-sm">Once redeemed, the balance will be added to your account and can be used for bookings.</p>
              </div>
            </div>
          </Card>
        )}

        {/* Manage Tab */}
        {activeTab === "manage" && (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-[#D4A574] mb-6" style={{ fontFamily: "Playfair Display" }}>
              My Gift Cards
            </h3>

            {myGiftCards.map((card) => (
              <Card key={card.code} className="p-6 bg-[#1a1a1a] border border-[rgba(212,165,116,0.3)]">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Gift className="w-5 h-5 text-[#D4A574]" />
                      <code className="font-mono text-sm text-gray-300">{card.code}</code>
                      <button
                        onClick={() => handleCopyCode(card.code)}
                        className="p-1 hover:bg-[#0a0a0a] rounded transition"
                      >
                        <Copy className="w-4 h-4 text-gray-400" />
                      </button>
                      {copiedCode === card.code && <span className="text-[#BFFF00] text-xs">Copied!</span>}
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-400">Amount</p>
                        <p className="text-white font-bold">K{card.amount}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Created</p>
                        <p className="text-white">{card.createdAt}</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Expires</p>
                        <p className="text-white">{card.expiresAt}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        card.status === "unused"
                          ? "bg-[#BFFF00]/20 text-[#BFFF00]"
                          : "bg-gray-700 text-gray-400"
                      }`}
                    >
                      {card.status === "unused" ? "Available" : "Redeemed"}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
