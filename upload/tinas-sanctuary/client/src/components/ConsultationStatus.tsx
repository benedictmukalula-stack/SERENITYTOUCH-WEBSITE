import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { CheckCircle, Clock, Video, AlertCircle } from "lucide-react";

interface ConsultationStatusProps {
  consultationId: number;
  status: "scheduled" | "in-progress" | "completed" | "cancelled";
  therapistName: string;
  scheduledTime: string;
  videoRoomUrl?: string;
}

export default function ConsultationStatus({
  consultationId,
  status,
  therapistName,
  scheduledTime,
  videoRoomUrl,
}: ConsultationStatusProps) {
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const scheduledDate = new Date(scheduledTime);
      const now = new Date();
      const diff = scheduledDate.getTime() - now.getTime();

      if (diff <= 0) {
        setIsLive(true);
        setTimeRemaining("Starting now");
      } else {
        setIsLive(false);
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeRemaining(`${hours}h ${minutes}m remaining`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [scheduledTime]);

  const getStatusIcon = () => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-6 h-6 text-[#BFFF00]" />;
      case "in-progress":
        return <Video className="w-6 h-6 text-[#E91E63] animate-pulse" />;
      case "cancelled":
        return <AlertCircle className="w-6 h-6 text-red-500" />;
      default:
        return <Clock className="w-6 h-6 text-[#D4A574]" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "completed":
        return "bg-[#BFFF00]/10 border-[#BFFF00]";
      case "in-progress":
        return "bg-[#E91E63]/10 border-[#E91E63]";
      case "cancelled":
        return "bg-red-500/10 border-red-500";
      default:
        return "bg-[#D4A574]/10 border-[#D4A574]";
    }
  };

  return (
    <Card className={`p-6 border-2 ${getStatusColor()} bg-[#1a1a1a]`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          {getStatusIcon()}
          <div>
            <h3 className="text-lg font-bold text-white capitalize mb-2">
              {status === "in-progress" ? "Consultation in Progress" : `Consultation ${status}`}
            </h3>
            <p className="text-gray-400 text-sm mb-1">Therapist: {therapistName}</p>
            <p className="text-gray-400 text-sm mb-3">Scheduled: {new Date(scheduledTime).toLocaleString()}</p>
            {status === "scheduled" && <p className="text-[#D4A574] font-semibold text-sm">{timeRemaining}</p>}
          </div>
        </div>

        {(status === "in-progress" || (status === "scheduled" && isLive)) && videoRoomUrl && (
          <a
            href={videoRoomUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-[#E91E63] hover:bg-[#c2185b] text-white rounded-lg font-bold transition flex items-center gap-2"
          >
            <Video className="w-5 h-5" />
            Join Now
          </a>
        )}
      </div>

      {status === "completed" && (
        <div className="mt-4 p-4 bg-[#BFFF00]/10 border border-[#BFFF00] rounded-lg">
          <p className="text-[#BFFF00] text-sm">✓ Thank you for your consultation. We hope you found it valuable!</p>
        </div>
      )}

      {status === "cancelled" && (
        <div className="mt-4 p-4 bg-red-500/10 border border-red-500 rounded-lg">
          <p className="text-red-400 text-sm">This consultation has been cancelled. Please book a new appointment.</p>
        </div>
      )}
    </Card>
  );
}
