import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TimeSlot {
  time: string;
  available: boolean;
}

interface CalendarProps {
  therapistId: number;
  onSelectSlot: (date: string, time: string) => void;
}

export default function TherapistCalendar({ therapistId, onSelectSlot }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const calendarDays = useMemo(() => {
    const days = [];
    const totalDays = daysInMonth(currentDate);
    const firstDay = firstDayOfMonth(currentDate);

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let i = 1; i <= totalDays; i++) {
      days.push(i);
    }

    return days;
  }, [currentDate]);

  const timeSlots: TimeSlot[] = [
    { time: "09:00", available: true },
    { time: "10:00", available: true },
    { time: "11:00", available: false },
    { time: "14:00", available: true },
    { time: "15:00", available: true },
    { time: "16:00", available: true },
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleSelectDay = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    setSelectedDate(dateStr);
  };

  const handleSelectTime = (time: string) => {
    if (selectedDate) {
      onSelectSlot(selectedDate, time);
    }
  };

  const monthName = currentDate.toLocaleString("default", { month: "long", year: "numeric" });

  return (
    <div className="space-y-6">
      {/* Calendar */}
      <Card className="p-6 bg-[#1a1a1a] border border-[rgba(212,165,116,0.3)]">
        <div className="flex items-center justify-between mb-6">
          <button onClick={handlePrevMonth} className="p-2 hover:bg-[#0a0a0a] rounded-lg transition">
            <ChevronLeft className="w-5 h-5 text-[#D4A574]" />
          </button>
          <h3 className="text-lg font-bold text-[#D4A574]">{monthName}</h3>
          <button onClick={handleNextMonth} className="p-2 hover:bg-[#0a0a0a] rounded-lg transition">
            <ChevronRight className="w-5 h-5 text-[#D4A574]" />
          </button>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-center text-sm font-semibold text-gray-400">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((day, idx) => (
            <button
              key={idx}
              onClick={() => day && handleSelectDay(day)}
              disabled={!day}
              className={`p-3 rounded-lg text-sm font-semibold transition ${
                !day
                  ? "bg-transparent text-transparent"
                  : selectedDate === `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
                    ? "bg-[#E91E63] text-white"
                    : "bg-[#0a0a0a] text-white hover:bg-[#E91E63]/20"
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </Card>

      {/* Time slots */}
      {selectedDate && (
        <Card className="p-6 bg-[#1a1a1a] border border-[rgba(212,165,116,0.3)]">
          <h4 className="text-lg font-bold text-[#D4A574] mb-4">Available Times</h4>
          <div className="grid grid-cols-3 gap-3">
            {timeSlots.map((slot) => (
              <button
                key={slot.time}
                onClick={() => slot.available && handleSelectTime(slot.time)}
                disabled={!slot.available}
                className={`p-3 rounded-lg font-semibold transition ${
                  !slot.available
                    ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                    : "bg-[#0a0a0a] text-white hover:bg-[#E91E63] border border-[rgba(212,165,116,0.3)] hover:border-[#E91E63]"
                }`}
              >
                {slot.time}
              </button>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
