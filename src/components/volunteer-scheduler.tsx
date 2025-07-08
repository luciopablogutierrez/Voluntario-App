"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { TimeSlotCard } from "@/components/time-slot-card";
import { SummaryCard } from "@/components/summary-card";

type Schedule = Record<string, Record<string, string[]>>;

const morningSlots = ["09:00", "10:00", "11:00", "12:00"];
const afternoonSlots = ["16:00", "17:00", "18:00", "19:00"];
const startDate = new Date("2024-07-18T00:00:00");
const endDate = new Date("2024-09-07T23:59:59");

const totalSlots = morningSlots.length + afternoonSlots.length;

export default function VolunteerScheduler() {
  const [schedule, setSchedule] = useState<Schedule>({});
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(startDate);

  const handleAddVolunteer = (date: Date, time: string, name: string) => {
    const dateKey = format(date, "yyyy-MM-dd");
    setSchedule((prev) => {
      const newSchedule = { ...prev };
      const daySchedule = newSchedule[dateKey] || {};
      const slotVolunteers = daySchedule[time] || [];
      newSchedule[dateKey] = {
        ...daySchedule,
        [time]: [...slotVolunteers, name.trim()],
      };
      return newSchedule;
    });
  };

  const selectedDateKey = selectedDate ? format(selectedDate, "yyyy-MM-dd") : "";
  const daySchedule = schedule[selectedDateKey] || {};

  const summary = useMemo(() => {
    if (!selectedDate) {
      return { totalVolunteers: 0, coveredSlots: 0, freeSlots: totalSlots, totalSlots };
    }

    const totalVolunteers = Object.values(daySchedule).flat().length;
    const coveredSlots = Object.values(daySchedule).filter(v => v.length > 0).length;
    const freeSlots = totalSlots - coveredSlots;
    
    return { totalVolunteers, coveredSlots, freeSlots, totalSlots };
  }, [daySchedule, selectedDate]);


  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <Card className="lg:col-span-1 flex justify-center shadow-lg">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          fromDate={startDate}
          toDate={endDate}
          disabled={(date) => date < startDate || date > endDate}
          initialFocus
          locale={es}
          className="p-4"
        />
      </Card>

      <div className="lg:col-span-2 space-y-8">
        {selectedDate ? (
          <div className="space-y-8 transition-opacity duration-300">
            <h2 className="text-3xl font-bold font-headline text-primary-foreground text-center capitalize">
              {format(selectedDate, "EEEE, d 'de' MMMM", { locale: es })}
            </h2>
            <div className="p-6 bg-card rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold mb-4 text-primary">Mañana (9:00 - 13:00)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {morningSlots.map((time) => (
                  <TimeSlotCard
                    key={time}
                    time={time}
                    volunteers={daySchedule[time] || []}
                    onAddVolunteer={(name) => handleAddVolunteer(selectedDate, time, name)}
                  />
                ))}
              </div>
            </div>
            <div className="p-6 bg-card rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold mb-4 text-primary">Tarde (16:00 - 20:00)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {afternoonSlots.map((time) => (
                  <TimeSlotCard
                    key={time}
                    time={time}
                    volunteers={daySchedule[time] || []}
                    onAddVolunteer={(name) => handleAddVolunteer(selectedDate, time, name)}
                  />
                ))}
              </div>
            </div>
            <SummaryCard {...summary} />
          </div>
        ) : (
          <Card className="flex items-center justify-center h-96 lg:col-span-2 shadow-lg">
              <p className="text-muted-foreground p-4 text-center">Por favor, selecciona una fecha en el calendario para ver los horarios disponibles.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
