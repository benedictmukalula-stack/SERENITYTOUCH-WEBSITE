import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Loader2, LogOut } from "lucide-react";
import { getLoginUrl } from "@/const";

export default function MemberPortal() {
  const { user, logout, isAuthenticated } = useAuth();
  const { data: memberProfile, isLoading: memberLoading } = trpc.member.getProfile.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const { data: bookings, isLoading: bookingsLoading } = trpc.booking.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: "Playfair Display" }}>
            Member Portal
          </h1>
          <p className="text-gray-600 mb-8">Please sign in to access your member portal</p>
          <a href={getLoginUrl()}>
            <Button className="bg-pink-500 hover:bg-pink-600 text-white rounded-full px-8">
              Sign In
            </Button>
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold" style={{ fontFamily: "Playfair Display" }}>
            Member Portal
          </h1>
          <Button
            variant="outline"
            onClick={logout}
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: "Playfair Display" }}>
            Welcome, {user?.name || "Member"}
          </h2>
          <p className="text-gray-600">{user?.email}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Membership Status */}
          <Card className="p-8 border-0 shadow-lg">
            <h3 className="text-2xl font-bold mb-6" style={{ fontFamily: "Playfair Display" }}>
              Membership Status
            </h3>
            {memberLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
              </div>
            ) : memberProfile ? (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Current Tier</p>
                  <p className="text-2xl font-bold capitalize text-pink-500">
                    {memberProfile.membershipTier}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Monthly Sessions</p>
                  <p className="text-lg">
                    {memberProfile.monthlySessionsUsed} / {memberProfile.monthlySessionsLimit}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Renewal Date</p>
                  <p className="text-lg">
                    {new Date(memberProfile.renewalDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">You don't have an active membership yet</p>
                <a href="/contact">
                  <Button className="bg-pink-500 hover:bg-pink-600 text-white rounded-full">
                    Upgrade to Member
                  </Button>
                </a>
              </div>
            )}
          </Card>

          {/* Quick Stats */}
          <Card className="p-8 border-0 shadow-lg">
            <h3 className="text-2xl font-bold mb-6" style={{ fontFamily: "Playfair Display" }}>
              Account Info
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Member Since</p>
                <p className="text-lg">
                  {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Last Visit</p>
                <p className="text-lg">
                  {new Date(user?.lastSignedIn || Date.now()).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Account Status</p>
                <p className="text-lg text-green-600 font-semibold">Active</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Booking History */}
        <Card className="mt-8 p-8 border-0 shadow-lg">
          <h3 className="text-2xl font-bold mb-6" style={{ fontFamily: "Playfair Display" }}>
            Your Bookings
          </h3>
          {bookingsLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
            </div>
          ) : bookings && bookings.length > 0 ? (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-lg">{booking.serviceType}</h4>
                      <p className="text-sm text-gray-600">
                        {new Date(booking.bookingDate).toLocaleDateString()} at{" "}
                        {new Date(booking.bookingDate).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      {booking.therapistName && (
                        <p className="text-sm text-gray-600">Therapist: {booking.therapistName}</p>
                      )}
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${
                        booking.status === "confirmed"
                          ? "bg-green-100 text-green-800"
                          : booking.status === "completed"
                            ? "bg-blue-100 text-blue-800"
                            : booking.status === "cancelled"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">No bookings yet</p>
              <a href="/contact">
                <Button className="bg-pink-500 hover:bg-pink-600 text-white rounded-full">
                  Book a Session
                </Button>
              </a>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
