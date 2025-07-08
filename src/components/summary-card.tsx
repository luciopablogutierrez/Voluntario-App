import { Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SummaryCardProps {
  totalVolunteers: number;
  coveredSlots: number;
  freeSlots: number;
  totalSlots: number;
}

interface StatProps {
    value: number;
    label: string;
    colorClass: string;
}

function Stat({ value, label, colorClass }: StatProps) {
    return (
        <div className="text-center">
            <p className={`text-4xl font-bold ${colorClass}`}>{value}</p>
            <p className="text-sm text-muted-foreground">{label}</p>
        </div>
    );
}

export function SummaryCard({ totalVolunteers, coveredSlots, freeSlots, totalSlots }: SummaryCardProps) {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl font-semibold text-card-foreground">
          <Users className="w-6 h-6" />
          Resumen del Día
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <Stat value={totalVolunteers} label="Voluntarios" colorClass="text-primary" />
            <Stat value={coveredSlots} label="Slots Cubiertos" colorClass="text-chart-2" />
            <Stat value={freeSlots} label="Slots Libres" colorClass="text-accent" />
            <Stat value={totalSlots} label="Total Slots" colorClass="text-chart-4" />
        </div>
      </CardContent>
    </Card>
  );
}
