import Link from "next/link";
import { Car, Fuel, Calendar, Settings2 } from "lucide-react";
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
  };
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">
          {vehicle.brand} {vehicle.model}
        </CardTitle>
        <Car className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent className="flex-1">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-4">
          <Badge variant="secondary" className="font-mono">
            {vehicle.vehicleNumber}
          </Badge>
          <Badge variant="outline">{vehicle.year}</Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Fuel className="h-4 w-4 text-muted-foreground" />
            <span className="capitalize">{vehicle.fuelType}</span>
          </div>
          <div className="flex items-center gap-2">
            <Settings2 className="h-4 w-4 text-muted-foreground" />
            <span>{vehicle.mileage.toLocaleString()} km</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href={`/vehicles/${vehicle.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
