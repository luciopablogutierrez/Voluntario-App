"use client";

import { useState, type FormEvent } from "react";
import { UserPlus, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface TimeSlotCardProps {
  time: string;
  volunteers: string[];
  onAddVolunteer: (name: string) => void;
}

export function TimeSlotCard({ time, volunteers, onAddVolunteer }: TimeSlotCardProps) {
  const [name, setName] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAddVolunteer(name.trim());
      setName("");
    }
  };
  
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
            volunteers.map((volunteer, index) => (
              <Badge key={index} variant="secondary" className="text-base font-medium">
                {volunteer}
              </Badge>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">¡Sé el primero en anotarte!</p>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
          <Input
            type="text"
            placeholder="Nombre del voluntario"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-background"
            aria-label="Nombre del voluntario"
          />
          <Button type="submit" size="icon" className="bg-accent hover:bg-accent/90 shrink-0 text-accent-foreground" aria-label="Agregar voluntario">
            <UserPlus className="h-5 w-5" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
