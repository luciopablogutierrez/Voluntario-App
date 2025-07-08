"use client";

import { useState, useMemo } from "react";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, isWithinInterval, addDays, subDays, addWeeks, subWeeks, isSameMonth } from "date-fns";
import { es } from "date-fns/locale";
import type { DateRange } from "react-day-picker";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { TimeSlotCard } from "@/components/time-slot-card";
import { SummaryCard } from "@/components/summary-card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  
  const [viewDate, setViewDate] = useState<Date>(startDate);
  const [calendarMonth, setCalendarMonth] = useState<Date>(startDate);

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

  const handlePrev = () => {
    if (mode === 'day') {
      const newDate = subDays(viewDate, 1);
      if (newDate >= startDate) setViewDate(newDate);
    } else if (mode === 'week') {
      const newDate = subWeeks(viewDate, 1);
      if (isWithinInterval(startOfWeek(newDate, {locale: es}), {start: startDate, end: endDate})) {
        setViewDate(newDate);
      }
    }
  };

  const handleNext = () => {
    if (mode === 'day') {
      const newDate = addDays(viewDate, 1);
      if (newDate <= endDate) setViewDate(newDate);
    } else if (mode === 'week') {
      const newDate = addWeeks(viewDate, 1);
      if (isWithinInterval(startOfWeek(newDate, {locale: es}), {start: startDate, end: endDate})) {
        setViewDate(newDate);
      }
    }
  };

  const handleDayClickInCalendar = (day: Date) => {
    if (day < startDate || day > endDate) return;
    setViewDate(day);
    setMode('day');
  };

  const { selectedDay, selectedRange } = useMemo(() => {
    if (mode === 'day') {
      return { selectedDay: viewDate, selectedRange: undefined };
    }
    if (mode === 'week') {
      const from = startOfWeek(viewDate, { locale: es });
      const to = endOfWeek(viewDate, { locale: es });
      return { selectedDay: undefined, selectedRange: { from, to } };
    }
    if (mode === 'month') {
        const from = startOfMonth(calendarMonth);
        const to = endOfMonth(calendarMonth);
        return { selectedDay: undefined, selectedRange: { from, to } };
    }
    return { selectedDay: undefined, selectedRange: undefined };
  }, [mode, viewDate, calendarMonth]);
  
  const summary = useMemo(() => {
    let daysToSummarize: Date[] = [];
    if (mode === 'day' && selectedDay) {
        daysToSummarize = [selectedDay];
    } else if ((mode === 'week' || mode === 'month') && selectedRange?.from && selectedRange?.to) {
        daysToSummarize = eachDayOfInterval({ start: selectedRange.from, end: selectedRange.to });
    }

    const validDays = daysToSummarize.filter(d => isWithinInterval(d, {start: startDate, end: endDate}));
    let totalVolunteers = 0;
    let coveredSlots = 0;
    
    for (const day of validDays) {
        const dateKey = format(day, "yyyy-MM-dd");
        const daySchedule = schedule[dateKey] || {};
        totalVolunteers += Object.values(daySchedule).flat().length;
        coveredSlots += Object.values(daySchedule).filter(v => v.length > 0).length;
    }
    
    const totalSlots = validDays.length * dailyTotalSlots;
    const freeSlots = totalSlots - coveredSlots;
    return { totalVolunteers, coveredSlots, freeSlots, totalSlots };
  }, [mode, selectedDay, selectedRange, schedule]);

  const DayWeekNavigator = () => {
    const title = mode === 'day' && selectedDay
        ? format(selectedDay, "EEEE, d 'de' MMMM", { locale: es })
        : mode === 'week' && selectedRange?.from
        ? `${format(selectedRange.from, "d MMM", { locale: es })} - ${format(selectedRange.to, "d MMM, yyyy", { locale: es })}`
        : '';

    return (
        <div className="flex items-center justify-between">
            <Button onClick={handlePrev} variant="outline" size="icon" aria-label="Anterior">
                <ChevronLeft className="h-4 w-4" />
            </Button>
            <h3 className="text-sm font-semibold text-center capitalize grow px-2">
                {title}
            </h3>
            <Button onClick={handleNext} variant="outline" size="icon" aria-label="Siguiente">
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    );
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <Card className="lg:col-span-1 shadow-lg">
        <div className="p-4 border-b">
          <Tabs value={mode} onValueChange={(value) => {
              const newMode = value as ViewMode;
              setMode(newMode);
              if (newMode === 'month' && !isSameMonth(viewDate, calendarMonth)) {
                  setCalendarMonth(viewDate);
              }
          }} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="day">Día</TabsTrigger>
              <TabsTrigger value="week">Semana</TabsTrigger>
              <TabsTrigger value="month">Mes</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {mode === 'day' && (
          <div className="p-4">
            <DayWeekNavigator />
          </div>
        )}

        {mode === 'week' && (
          <div className="p-4">
            <DayWeekNavigator />
            <Calendar
              mode="range"
              month={viewDate}
              onMonthChange={setViewDate}
              selected={selectedRange}
              onSelect={(range, day, modifiers) => !modifiers.disabled && handleDayClickInCalendar(day)}
              fromDate={startDate}
              toDate={endDate}
              disabled={(date) => date < startDate || date > endDate}
              locale={es}
              className="mt-4 flex justify-center"
            />
          </div>
        )}

        {mode === 'month' && (
          <Calendar
            mode="range"
            month={calendarMonth}
            onMonthChange={setCalendarMonth}
            selected={selectedRange}
            onSelect={(range, day, modifiers) => !modifiers.disabled && handleDayClickInCalendar(day)}
            fromDate={startDate}
            toDate={endDate}
            disabled={(date) => date < startDate || date > endDate}
            locale={es}
            className="p-4 flex justify-center"
          />
        )}
      </Card>

      <div className="lg:col-span-2 space-y-8">
        {mode === 'day' && selectedDay ? (
          <div className="space-y-8 transition-opacity duration-300">
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
        ) : (mode === 'week' || mode === 'month') && selectedRange?.from && selectedRange?.to ? (
          <div className="space-y-8 transition-opacity duration-300">
             <h2 className="text-3xl font-bold font-headline text-primary-foreground text-center capitalize">
              {mode === 'week' 
                ? `${format(selectedRange.from, "d MMM", { locale: es })} - ${format(selectedRange.to, "d MMM, yyyy", { locale: es })}`
                : format(selectedRange.from, "MMMM 'de' yyyy", { locale: es })
              }
            </h2>
            <SummaryCard {...summary} />
          </div>
        ) : (
          <Card className="flex items-center justify-center h-96 lg:col-span-2 shadow-lg">
              <p className="text-muted-foreground p-4 text-center">Selecciona un día o rango en el panel de la izquierda.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
