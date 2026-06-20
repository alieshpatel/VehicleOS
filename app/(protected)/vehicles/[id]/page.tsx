import { getVehicle } from "@/actions/vehicles";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { VehicleDetailTabs } from "@/components/vehicles/vehicle-detail-tabs";

export default async function VehicleDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const vehicle = await getVehicle(params.id);

  if (!vehicle) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/vehicles">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {vehicle.brand} {vehicle.model}
          </h1>
          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
            <Badge variant="secondary" className="font-mono">
              {vehicle.vehicleNumber}
            </Badge>
            <span>•</span>
            <span>{vehicle.year}</span>
            <span>•</span>
            <span className="capitalize">{vehicle.fuelType}</span>
            <span>•</span>
            <span>{vehicle.mileage.toLocaleString()} km</span>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {/* Edit / Delete can be implemented as Dialogs or separate pages later */}
          <Button variant="outline" size="sm" className="hidden sm:flex">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="destructive" size="sm" className="hidden sm:flex">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      <VehicleDetailTabs vehicleId={vehicle.id} />
    </div>
  );
}
