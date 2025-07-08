"use client";

import { useState, useMemo } from "react";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, isWithinInterval } from "date-fns";
import { es } from "date-fns/locale";
import type { DateRange } from "react-day-picker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { TimeSlotCard } from "@/components/time-slot-card";
import { SummaryCard } from "@/components/summary-card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Schedule = Record<string, Record<string, string[]>>;
type ViewMode = "day" | "week" | "month";

const morningSlots = ["09:00", "10:00", "11:00", "12:00"];
const afternoonSlots = ["16:00", "17:00", "18:00", "19:00"];
const startDate = new Date("2024-07-18T00:00:00");
const endDate = new Date("2024-09-07T23:59:59");

const dailyTotalSlots = morningSlots.length + afternoonSlots.length;

export default function VolunteerScheduler() {
  const [schedule, setSchedule] = useState<Schedule>({});
  const [mode, setMode] = useState<ViewMode>("day");
  
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(startDate);
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>();

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
  
  const handleDayClick = (day: Date) => {
    if (day < startDate || day > endDate) return;

    if (mode === "day") {
      setSelectedDay(day);
      setSelectedRange(undefined);
    } else if (mode === "week") {
      const from = startOfWeek(day, { locale: es });
      const to = endOfWeek(day, { locale: es });
      setSelectedRange({ from, to });
      setSelectedDay(undefined);
    } else {
      const from = startOfMonth(day);
      const to = endOfMonth(day);
      setSelectedRange({ from, to });
      setSelectedDay(undefined);
    }
  };

  const summary = useMemo(() => {
    if (mode === 'day' && selectedDay) {
        const daySchedule = schedule[format(selectedDay, "yyyy-MM-dd")] || {};
        const totalVolunteers = Object.values(daySchedule).flat().length;
        const coveredSlots = Object.values(daySchedule).filter(v => v.length > 0).length;
        const freeSlots = dailyTotalSlots - coveredSlots;
        return { totalVolunteers, coveredSlots, freeSlots, totalSlots: dailyTotalSlots };
    }
    
    if ((mode === 'week' || mode === 'month') && selectedRange?.from && selectedRange?.to) {
        const daysInInterval = eachDayOfInterval({ start: selectedRange.from, end: selectedRange.to })
            .filter(d => isWithinInterval(d, {start: startDate, end: endDate}));
        
        let totalVolunteers = 0;
        let coveredSlots = 0;

        for (const day of daysInInterval) {
            const dateKey = format(day, "yyyy-MM-dd");
            const daySchedule = schedule[dateKey] || {};
            totalVolunteers += Object.values(daySchedule).flat().length;
            coveredSlots += Object.values(daySchedule).filter(v => v.length > 0).length;
        }
        
        const totalSlots = daysInInterval.length * dailyTotalSlots;
        const freeSlots = totalSlots - coveredSlots;
        return { totalVolunteers, coveredSlots, freeSlots, totalSlots };
    }

    return { totalVolunteers: 0, coveredSlots: 0, freeSlots: dailyTotalSlots, totalSlots: dailyTotalSlots };
  }, [mode, selectedDay, selectedRange, schedule]);

  const selectedProp = mode === "day" ? selectedDay : selectedRange;
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <Card className="lg:col-span-1 shadow-lg">
        <div className="p-4 border-b">
          <Tabs value={mode} onValueChange={(value) => setMode(value as ViewMode)} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="day">Día</TabsTrigger>
              <TabsTrigger value="week">Semana</TabsTrigger>
              <TabsTrigger value="month">Mes</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <Calendar
          mode={mode === "day" ? "single" : "range"}
          selected={selectedProp}
          onDayClick={handleDayClick}
          fromDate={startDate}
          toDate={endDate}
          disabled={(date) => date < startDate || date > endDate}
          initialFocus={mode === 'day'}
          locale={es}
          className="p-4 flex justify-center"
        />
      </Card>

      <div className="lg:col-span-2 space-y-8">
        {mode === 'day' && selectedDay ? (
          <div className="space-y-8 transition-opacity duration-300">
            <h2 className="text-3xl font-bold font-headline text-primary-foreground text-center capitalize">
              {format(selectedDay, "EEEE, d 'de' MMMM", { locale: es })}
            </h2>
            <div className="p-6 bg-card rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold mb-4 text-primary">Mañana (9:00 - 13:00)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {morningSlots.map((time) => (
                  <TimeSlotCard
                    key={time}
                    time={time}
                    volunteers={(schedule[format(selectedDay, "yyyy-MM-dd")] || {})[time] || []}
                    onAddVolunteer={(name) => handleAddVolunteer(selectedDay, time, name)}
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
                    volunteers={(schedule[format(selectedDay, "yyyy-MM-dd")] || {})[time] || []}
                    onAddVolunteer={(name) => handleAddVolunteer(selectedDay, time, name)}
                  />
                ))}
              </div>
            </div>
            <SummaryCard {...summary} />
          </div>
        ) : mode !== 'day' && selectedRange?.from && selectedRange?.to ? (
          <div className="space-y-8 transition-opacity duration-300">
             <h2 className="text-3xl font-bold font-headline text-primary-foreground text-center capitalize">
              {format(selectedRange.from, "d MMM", { locale: es })} - {format(selectedRange.to, "d MMM, yyyy", { locale: es })}
            </h2>
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
