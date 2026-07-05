import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Calendar, TrendingUp, Gift, Clock, CheckCircle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

const wellnessData = [
  { month: "Jan", sessions: 2, satisfaction: 85 },
  { month: "Feb", sessions: 3, satisfaction: 88 },
  { month: "Mar", sessions: 4, satisfaction: 92 },
  { month: "Apr", sessions: 3, satisfaction: 90 },
  { month: "May", sessions: 5, satisfaction: 95 },
  { month: "Jun", sessions: 4, satisfaction: 93 },
];

const upcomingBookings = [
  { id: 1, therapist: "Tina Mwale", service: "Swedish Massage", date: "2026-07-10", time: "14:00", status: "confirmed" },
  { id: 2, therapist: "Grace Banda", service: "Hot Stone Therapy", date: "2026-07-15", time: "10:00", status: "confirmed" },
  { id: 3, therapist: "Patricia Nkomo", service: "Deep Tissue Massage", date: "2026-07-20", time: "15:30", status: "pending" },
];

const pastBookings = [
  { id: 1, therapist: "Tina Mwale", service: "Swedish Massage", date: "2026-06-25", rating: 5 },
  { id: 2, therapist: "Grace Banda", service: "Aromatherapy", date: "2026-06-18", rating: 5 },
  { id: 3, therapist: "Patricia Nkomo", service: "Hot Stone Therapy", date: "2026-06-10", rating: 4 },
];

export default function MemberDashboard() {
  const [activeTab, setActiveTab] = useState<"overview" | "bookings" | "history">("overview");

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-bold text-[#D4A574] mb-2" style={{ fontFamily: "Playfair Display" }}>
            Welcome Back, Sarah
          </h1>
          <p className="text-gray-400">Gold Member • Member since June 2024</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card className="p-6 bg-[#1a1a1a] border border-[rgba(212,165,116,0.3)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-2">Total Sessions</p>
                <p className="text-3xl font-bold text-[#D4A574]">24</p>
              </div>
              <Calendar className="w-10 h-10 text-[#D4A574] opacity-50" />
            </div>
          </Card>

          <Card className="p-6 bg-[#1a1a1a] border border-[rgba(212,165,116,0.3)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-2">Avg. Satisfaction</p>
                <p className="text-3xl font-bold text-[#BFFF00]">92%</p>
              </div>
              <TrendingUp className="w-10 h-10 text-[#BFFF00] opacity-50" />
            </div>
          </Card>

          <Card className="p-6 bg-[#1a1a1a] border border-[rgba(212,165,116,0.3)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-2">Rewards Earned</p>
                <p className="text-3xl font-bold text-[#E91E63]">K2,400</p>
              </div>
              <Gift className="w-10 h-10 text-[#E91E63] opacity-50" />
            </div>
          </Card>

          <Card className="p-6 bg-[#1a1a1a] border border-[rgba(212,165,116,0.3)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-2">Next Renewal</p>
                <p className="text-3xl font-bold text-white">45 days</p>
              </div>
              <Clock className="w-10 h-10 text-white opacity-50" />
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-[rgba(212,165,116,0.2)]">
          {(["overview", "bookings", "history"] as const).map((tab) => (
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

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-8 bg-[#1a1a1a] border border-[rgba(212,165,116,0.3)]">
              <h3 className="text-2xl font-bold text-[#D4A574] mb-6" style={{ fontFamily: "Playfair Display" }}>
                Wellness Progress
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={wellnessData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,165,116,0.1)" />
                  <XAxis dataKey="month" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #D4A574" }} />
                  <Line type="monotone" dataKey="satisfaction" stroke="#D4A574" strokeWidth={2} dot={{ fill: "#D4A574" }} />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-8 bg-[#1a1a1a] border border-[rgba(212,165,116,0.3)]">
              <h3 className="text-2xl font-bold text-[#D4A574] mb-6" style={{ fontFamily: "Playfair Display" }}>
                Sessions by Month
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={wellnessData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,165,116,0.1)" />
                  <XAxis dataKey="month" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip contentStyle={{ backgroundColor: "#1a1a1a", border: "1px solid #D4A574" }} />
                  <Bar dataKey="sessions" fill="#E91E63" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === "bookings" && (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-[#D4A574] mb-6" style={{ fontFamily: "Playfair Display" }}>
              Upcoming Bookings
            </h3>
            {upcomingBookings.map((booking) => (
              <Card key={booking.id} className="p-6 bg-[#1a1a1a] border border-[rgba(212,165,116,0.3)]">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2">{booking.service}</h4>
                    <p className="text-gray-400 text-sm mb-1">Therapist: {booking.therapist}</p>
                    <p className="text-gray-400 text-sm">{new Date(booking.date).toLocaleDateString()} at {booking.time}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        booking.status === "confirmed"
                          ? "bg-[#BFFF00]/20 text-[#BFFF00]"
                          : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {booking.status === "confirmed" ? "✓ Confirmed" : "Pending"}
                    </span>
                    <button className="px-4 py-2 bg-[#E91E63] hover:bg-[#c2185b] text-white rounded-lg font-semibold transition">
                      Reschedule
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* History Tab */}
        {activeTab === "history" && (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-[#D4A574] mb-6" style={{ fontFamily: "Playfair Display" }}>
              Past Sessions
            </h3>
            {pastBookings.map((booking) => (
              <Card key={booking.id} className="p-6 bg-[#1a1a1a] border border-[rgba(212,165,116,0.3)]">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-bold text-white mb-2">{booking.service}</h4>
                    <p className="text-gray-400 text-sm mb-1">Therapist: {booking.therapist}</p>
                    <p className="text-gray-400 text-sm">{new Date(booking.date).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-lg ${i < booking.rating ? "text-[#D4A574]" : "text-gray-600"}`}>
                        ★
                      </span>
                    ))}
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
