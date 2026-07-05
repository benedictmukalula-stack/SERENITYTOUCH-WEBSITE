import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Clock, MapPin, User } from "lucide-react";
import io from "socket.io-client";

interface LiveBooking {
  id: string;
  clientName: string;
  service: string;
  time: string;
  therapist: string;
  status: "confirmed" | "in-progress" | "completed";
}

export default function LiveBookings() {
  const [bookings, setBookings] = useState<LiveBooking[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    // Connect to Socket.io server
    const socket = io(window.location.origin, {
      path: "/socket.io",
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      setConnected(true);
      console.log("Connected to live bookings");
    });

    socket.on("booking_update", (booking: LiveBooking) => {
      setBookings((prev) => {
        const existing = prev.findIndex((b) => b.id === booking.id);
        if (existing >= 0) {
          const updated = [...prev];
          updated[existing] = booking;
          return updated;
        }
        return [booking, ...prev].slice(0, 5); // Keep last 5
      });
    });

    socket.on("disconnect", () => {
      setConnected(false);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "border-[#BFFF00]";
      case "in-progress":
        return "border-[#E91E63]";
      case "completed":
        return "border-[#D4A574]";
      default:
        return "border-gray-600";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <span className="px-3 py-1 rounded-full text-xs bg-[#BFFF00]/20 text-[#BFFF00]">Confirmed</span>;
      case "in-progress":
        return <span className="px-3 py-1 rounded-full text-xs bg-[#E91E63]/20 text-[#E91E63]">In Progress</span>;
      case "completed":
        return <span className="px-3 py-1 rounded-full text-xs bg-[#D4A574]/20 text-[#D4A574]">Completed</span>;
      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-[#D4A574]" style={{ fontFamily: "Playfair Display" }}>
          Live Bookings
        </h3>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${connected ? "bg-[#BFFF00]" : "bg-gray-600"}`} />
          <span className="text-xs text-gray-400">{connected ? "Live" : "Offline"}</span>
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {bookings.length === 0 ? (
          <Card className="p-6 bg-[#1a1a1a] border border-[rgba(212,165,116,0.3)] text-center">
            <p className="text-gray-400 text-sm">No active bookings at the moment</p>
          </Card>
        ) : (
          bookings.map((booking) => (
            <Card
              key={booking.id}
              className={`p-4 bg-[#1a1a1a] border-2 ${getStatusColor(booking.status)} transition-all`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-white">{booking.clientName}</h4>
                  <p className="text-sm text-gray-400">{booking.service}</p>
                </div>
                {getStatusBadge(booking.status)}
              </div>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#D4A574]" />
                  <span>{booking.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[#D4A574]" />
                  <span>{booking.therapist}</span>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
