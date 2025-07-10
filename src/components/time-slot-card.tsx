"use client";

import { Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getContrastColor } from "@/lib/utils";
import type { Volunteer } from "@/app/actions";
import { VolunteerInput } from "./volunteer-input";

interface TimeSlotCardProps {
  time: string;
  volunteers: Omit<Volunteer, 'id'>[];
  allVolunteers: Volunteer[];
  onAddVolunteer: (name: string) => void;
}

export function TimeSlotCard({ time, volunteers = [], allVolunteers, onAddVolunteer }: TimeSlotCardProps) {
  const endTime = `${(parseInt(time.split(':')[0]) + 1).toString().padStart(2, '0')}:00`;

  return (
    <Card className="flex flex-col h-full transition-all hover:shadow-lg bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-bold text-card-foreground">
          <Clock className="w-5 h-5 text-primary" />
          {`${time} - ${endTime}`}
        </CardTitle>
        <CardDescription>
          {volunteers.length > 0 ? `${volunteers.length} voluntario(s) registrado(s)` : 'Aún no hay voluntarios'}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow min-h-[4rem]">
        <div className="flex flex-wrap gap-2">
          {volunteers.length > 0 ? (
            volunteers.map((volunteer) => (
              <Badge 
                key={volunteer.name} 
                variant="secondary" 
                className="text-base font-medium border-transparent"
                style={{
                  backgroundColor: volunteer.color,
                  color: getContrastColor(volunteer.color)
                }}
              >
                {volunteer.name}
              </Badge>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">¡Sé el primero en anotarte!</p>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <VolunteerInput allVolunteers={allVolunteers} onAddVolunteer={onAddVolunteer} />
      </CardFooter>
    </Card>
  );
}
