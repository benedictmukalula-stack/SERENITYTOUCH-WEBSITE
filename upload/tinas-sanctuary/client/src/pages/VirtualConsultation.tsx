import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, Video } from "lucide-react";

interface Therapist {
  id: number;
  name: string;
  specialty: string;
  availability: string[];
  image: string;
}

export default function VirtualConsultation() {
  const [selectedTherapist, setSelectedTherapist] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [consultationType, setConsultationType] = useState<"initial" | "follow-up">("initial");
  const [submitted, setSubmitted] = useState(false);

  const therapists: Therapist[] = [
    {
      id: 1,
      name: "Tina Mwale",
      specialty: "Holistic Wellness",
      availability: ["Mon", "Wed", "Fri"],
      image: "👩‍⚕️",
    },
    {
      id: 2,
      name: "Grace Banda",
      specialty: "Stress Relief",
      availability: ["Tue", "Thu", "Sat"],
      image: "👩‍⚕️",
    },
    {
      id: 3,
      name: "Patricia Nkomo",
      specialty: "Sports Recovery",
      availability: ["Mon", "Tue", "Wed"],
      image: "👩‍⚕️",
    },
  ];

  const timeSlots = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTherapist && selectedDate && selectedTime) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-32 pb-20">
      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a] border-b border-[rgba(212,165,116,0.2)]">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-[#D4A574]" style={{ fontFamily: "Playfair Display" }}>
            Virtual Consultation
          </h1>
        </div>
      </nav>

      <div className="container mx-auto px-4 max-w-4xl">
        <Card className="p-8 bg-[#1a1a1a] border border-[rgba(212,165,116,0.3)] mb-8">
          <p className="text-gray-400 mb-6">
            Book a one-on-one video consultation with one of our certified therapists. Discuss your wellness goals and create a personalized treatment plan.
          </p>

          {/* Consultation Type */}
          <div className="mb-8">
            <label className="block text-lg font-bold text-[#D4A574] mb-4" style={{ fontFamily: "Playfair Display" }}>
              Consultation Type
            </label>
            <div className="flex gap-4">
              {(["initial", "follow-up"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setConsultationType(type)}
                  className={`px-6 py-3 rounded-lg border-2 transition ${
                    consultationType === type
                      ? "border-[#E91E63] bg-[#E91E63]/10 text-[#E91E63]"
                      : "border-[rgba(212,165,116,0.3)] text-gray-400 hover:border-[rgba(212,165,116,0.6)]"
                  }`}
                >
                  {type === "initial" ? "Initial Consultation" : "Follow-up Session"}
                </button>
              ))}
            </div>
          </div>

          {/* Therapist Selection */}
          <div className="mb-8">
            <label className="block text-lg font-bold text-[#D4A574] mb-4" style={{ fontFamily: "Playfair Display" }}>
              Select Therapist
            </label>
            <div className="grid md:grid-cols-3 gap-4">
              {therapists.map((therapist) => (
                <Card
                  key={therapist.id}
                  onClick={() => setSelectedTherapist(therapist.id)}
                  className={`p-6 cursor-pointer border-2 transition ${
                    selectedTherapist === therapist.id
                      ? "border-[#E91E63] bg-[#E91E63]/10"
                      : "border-[rgba(212,165,116,0.3)] hover:border-[rgba(212,165,116,0.6)]"
                  } bg-[#0a0a0a]`}
                >
                  <div className="text-4xl mb-3">{therapist.image}</div>
                  <h3 className="font-bold text-white mb-1">{therapist.name}</h3>
                  <p className="text-sm text-[#D4A574] mb-3">{therapist.specialty}</p>
                  <p className="text-xs text-gray-400">Available: {therapist.availability.join(", ")}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* Date & Time Selection */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <label className="block text-lg font-bold text-[#D4A574] mb-4" style={{ fontFamily: "Playfair Display" }}>
                Select Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-[rgba(212,165,116,0.3)] rounded-lg px-4 py-3 text-white focus:border-[#D4A574] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-lg font-bold text-[#D4A574] mb-4" style={{ fontFamily: "Playfair Display" }}>
                Select Time
              </label>
              <select
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full bg-[#0a0a0a] border border-[rgba(212,165,116,0.3)] rounded-lg px-4 py-3 text-white focus:border-[#D4A574] focus:outline-none"
              >
                <option value="">Choose a time slot</option>
                {timeSlots.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            className="w-full bg-[#E91E63] hover:bg-[#c2185b] text-white py-3 rounded-lg font-bold transition"
          >
            <Video className="w-5 h-5 mr-2" />
            Book Video Consultation
          </Button>

          {submitted && (
            <div className="mt-6 p-4 bg-[#BFFF00]/20 border border-[#BFFF00] rounded-lg">
              <p className="text-[#BFFF00] font-semibold">✓ Consultation booked successfully!</p>
              <p className="text-gray-400 text-sm mt-2">You'll receive a video link via email 24 hours before your consultation.</p>
            </div>
          )}
        </Card>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: "🎥", title: "Easy Video Call", desc: "Join from anywhere using Jitsi Meet" },
            { icon: "⏱️", title: "30 Minutes", desc: "Dedicated one-on-one consultation time" },
            { icon: "📋", title: "Personalized Plan", desc: "Get a custom wellness recommendation" },
          ].map((item, idx) => (
            <Card key={idx} className="p-6 bg-[#1a1a1a] border border-[rgba(212,165,116,0.3)] text-center">
              <div className="text-4xl mb-3">{item.icon}</div>
              <h3 className="font-bold text-white mb-2">{item.title}</h3>
              <p className="text-sm text-gray-400">{item.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
