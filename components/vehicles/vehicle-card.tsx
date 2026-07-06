import Link from "next/link";
import { Car, Fuel, Settings2, ArrowRight, Gauge } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface VehicleCardProps {
  vehicle: {
    id: string;
    brand: string;
    model: string;
    year: number;
    vehicleNumber: string;
    fuelType: string;
    mileage: number;
    avgMileage?: number; // Optional since it might not be present everywhere yet
  };
}

const fuelGradients: Record<string, string> = {
  petrol: "from-amber-500 to-orange-500",
  diesel: "from-slate-500 to-zinc-600",
  cng: "from-emerald-500 to-teal-500",
  electric: "from-cyan-500 to-blue-500",
  hybrid: "from-violet-500 to-purple-500",
};

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const gradient = fuelGradients[vehicle.fuelType.toLowerCase()] || "from-violet-500 to-indigo-500";

  return (
    <Card className="group relative flex flex-col overflow-hidden border-border/50 hover:border-border transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5">
      {/* Top gradient accent */}
      <div className={`h-1 w-full bg-gradient-to-r ${gradient}`} />

      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-lg font-bold">
          {vehicle.brand} {vehicle.model}
        </CardTitle>
        <div className={`h-9 w-9 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-sm`}>
          <Car className="h-4 w-4 text-white" />
        </div>
      </CardHeader>

      <CardContent className="flex-1 space-y-4">
        <div className="flex items-center space-x-2 text-sm">
          <Badge variant="secondary" className="font-mono text-xs tracking-wider">
            {vehicle.vehicleNumber}
          </Badge>
          <Badge variant="outline" className="text-xs">{vehicle.year}</Badge>
          {vehicle.avgMileage ? (
            <Badge variant="outline" className="text-xs border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 ml-auto">
              {vehicle.avgMileage} km/l
            </Badge>
          ) : null}
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 rounded-lg bg-muted/30 px-3 py-2">
            <Fuel className="h-4 w-4 text-muted-foreground" />
            <span className="capitalize text-sm font-medium">{vehicle.fuelType}</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-muted/30 px-3 py-2">
            <Gauge className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-mono font-medium">{vehicle.mileage.toLocaleString()} km</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <Button
          asChild
          className={`w-full group/btn bg-gradient-to-r ${gradient} hover:opacity-90 text-white border-0 shadow-sm`}
        >
          <Link href={`/vehicles/${vehicle.id}`}>
            View Details
            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-200 group-hover/btn:translate-x-0.5" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
