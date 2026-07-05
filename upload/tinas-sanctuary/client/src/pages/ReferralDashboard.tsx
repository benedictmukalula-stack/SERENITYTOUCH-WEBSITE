import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Gift, Users, TrendingUp } from "lucide-react";
import { toast } from "sonner";

export default function ReferralDashboard() {
  const [copied, setCopied] = useState(false);
  const referralCode = "TINA8K9M2X5L";

  const stats = [
    { label: "Total Referrals", value: "12", icon: Users, color: "text-[#BFFF00]" },
    { label: "Completed", value: "8", icon: TrendingUp, color: "text-[#E91E63]" },
    { label: "Pending Rewards", value: "K2,000", icon: Gift, color: "text-[#D4A574]" },
    { label: "Claimed Rewards", value: "K3,500", icon: Gift, color: "text-[#BFFF00]" },
  ];

  const referrals = [
    { id: 1, name: "Sarah Johnson", status: "completed", reward: "K500", date: "2026-06-15" },
    { id: 2, name: "Michael Chen", status: "completed", reward: "K500", date: "2026-06-10" },
    { id: 3, name: "Emma Wilson", status: "pending", reward: "K500", date: "2026-07-01" },
    { id: 4, name: "David Brown", status: "pending", reward: "K500", date: "2026-07-02" },
  ];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    toast.success("Referral code copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-32 pb-20">
      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a] border-b border-[rgba(212,165,116,0.2)]">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-[#D4A574]" style={{ fontFamily: "Playfair Display" }}>
            Referral Rewards
          </h1>
        </div>
      </nav>

      <div className="container mx-auto px-4">
        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <Card
                key={idx}
                className="p-6 bg-[#1a1a1a] border border-[rgba(212,165,116,0.3)] hover:border-[rgba(212,165,116,0.6)] transition"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-gray-400 text-sm mb-2">{stat.label}</p>
                    <p className="text-3xl font-bold text-white">{stat.value}</p>
                  </div>
                  <Icon className={`w-8 h-8 ${stat.color}`} />
                </div>
              </Card>
            );
          })}
        </div>

        {/* Referral Code Section */}
        <Card className="p-8 bg-[#1a1a1a] border border-[rgba(212,165,116,0.3)] mb-8">
          <h2 className="text-2xl font-bold text-[#D4A574] mb-4" style={{ fontFamily: "Playfair Display" }}>
            Your Referral Code
          </h2>
          <p className="text-gray-400 mb-6">
            Share this code with friends. When they sign up and complete their first booking, you'll earn K500 credit!
          </p>
          <div className="flex items-center gap-4">
            <div className="flex-1 bg-[#0a0a0a] border border-[rgba(212,165,116,0.3)] rounded-lg px-6 py-4">
              <p className="text-2xl font-bold text-[#D4A574] font-mono">{referralCode}</p>
            </div>
            <Button
              onClick={handleCopyCode}
              className={`px-6 py-4 rounded-lg transition ${
                copied
                  ? "bg-[#BFFF00] text-black"
                  : "bg-[#E91E63] hover:bg-[#c2185b] text-white"
              }`}
            >
              <Copy className="w-5 h-5 mr-2" />
              {copied ? "Copied!" : "Copy Code"}
            </Button>
          </div>
        </Card>

        {/* Referrals Table */}
        <Card className="p-8 bg-[#1a1a1a] border border-[rgba(212,165,116,0.3)]">
          <h2 className="text-2xl font-bold text-[#D4A574] mb-6" style={{ fontFamily: "Playfair Display" }}>
            Your Referrals
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[rgba(212,165,116,0.2)]">
                  <th className="text-left py-4 px-4 text-gray-400 font-semibold">Name</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-semibold">Status</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-semibold">Reward</th>
                  <th className="text-left py-4 px-4 text-gray-400 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {referrals.map((referral) => (
                  <tr key={referral.id} className="border-b border-[rgba(212,165,116,0.1)] hover:bg-[#0a0a0a] transition">
                    <td className="py-4 px-4 text-white">{referral.name}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          referral.status === "completed"
                            ? "bg-[#BFFF00]/20 text-[#BFFF00]"
                            : "bg-[#D4A574]/20 text-[#D4A574]"
                        }`}
                      >
                        {referral.status.charAt(0).toUpperCase() + referral.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-[#D4A574] font-semibold">{referral.reward}</td>
                    <td className="py-4 px-4 text-gray-400">{referral.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
