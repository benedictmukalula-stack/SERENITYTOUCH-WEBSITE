import { Card } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, Users, DollarSign, Calendar } from "lucide-react";

export default function Analytics() {
  // Sample data
  const bookingTrend = [
    { month: "Jan", bookings: 24, revenue: 19200 },
    { month: "Feb", bookings: 32, revenue: 25600 },
    { month: "Mar", bookings: 28, revenue: 22400 },
    { month: "Apr", bookings: 45, revenue: 36000 },
    { month: "May", bookings: 52, revenue: 41600 },
    { month: "Jun", bookings: 48, revenue: 38400 },
  ];

  const membershipBreakdown = [
    { name: "Silver", value: 35, fill: "#D4A574" },
    { name: "Gold", value: 50, fill: "#E91E63" },
    { name: "Platinum", value: 15, fill: "#BFFF00" },
  ];

  const therapistPerformance = [
    { name: "Therapist A", bookings: 28, rating: 4.8 },
    { name: "Therapist B", bookings: 24, rating: 4.6 },
    { name: "Therapist C", bookings: 32, rating: 4.9 },
    { name: "Therapist D", bookings: 20, rating: 4.5 },
  ];

  const stats = [
    {
      label: "Total Bookings",
      value: "184",
      icon: Calendar,
      color: "text-[#BFFF00]",
    },
    {
      label: "Active Members",
      value: "98",
      icon: Users,
      color: "text-[#E91E63]",
    },
    {
      label: "Monthly Revenue",
      value: "K156,800",
      icon: DollarSign,
      color: "text-[#D4A574]",
    },
    {
      label: "Growth Rate",
      value: "+23%",
      icon: TrendingUp,
      color: "text-[#BFFF00]",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-32 pb-20">
      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a] border-b border-[rgba(212,165,116,0.2)]">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-[#D4A574]" style={{ fontFamily: "Playfair Display" }}>
            Booking Analytics
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

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Booking Trend */}
          <Card className="p-6 bg-[#1a1a1a] border border-[rgba(212,165,116,0.3)]">
            <h3 className="text-lg font-bold text-[#D4A574] mb-4" style={{ fontFamily: "Playfair Display" }}>
              Booking Trend
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={bookingTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,165,116,0.2)" />
                <XAxis stroke="#999" />
                <YAxis stroke="#999" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a1a",
                    border: "1px solid rgba(212,165,116,0.3)",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="bookings"
                  stroke="#E91E63"
                  strokeWidth={2}
                  dot={{ fill: "#E91E63" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Membership Breakdown */}
          <Card className="p-6 bg-[#1a1a1a] border border-[rgba(212,165,116,0.3)]">
            <h3 className="text-lg font-bold text-[#D4A574] mb-4" style={{ fontFamily: "Playfair Display" }}>
              Membership Breakdown
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={membershipBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {membershipBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1a1a1a",
                    border: "1px solid rgba(212,165,116,0.3)",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Therapist Performance */}
        <Card className="p-6 bg-[#1a1a1a] border border-[rgba(212,165,116,0.3)]">
          <h3 className="text-lg font-bold text-[#D4A574] mb-4" style={{ fontFamily: "Playfair Display" }}>
            Therapist Performance
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={therapistPerformance}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(212,165,116,0.2)" />
              <XAxis stroke="#999" />
              <YAxis stroke="#999" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a1a1a",
                  border: "1px solid rgba(212,165,116,0.3)",
                }}
              />
              <Legend />
              <Bar dataKey="bookings" fill="#E91E63" />
              <Bar dataKey="rating" fill="#D4A574" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
