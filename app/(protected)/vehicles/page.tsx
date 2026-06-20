import { getVehicles } from "@/actions/vehicles";
import { VehicleCard } from "@/components/vehicles/vehicle-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, CarFront } from "lucide-react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default async function VehiclesPage(props: {
  searchParams: Promise<{ q?: string; fuel?: string }>;
}) {
  const searchParams = await props.searchParams;
  const q = searchParams?.q || "";
  const fuel = searchParams?.fuel || "all";
  const vehicles = await getVehicles(q, fuel);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vehicles</h1>
          <p className="text-muted-foreground">
            Manage your vehicles and track their details.
          </p>
        </div>
        <Button asChild>
          <Link href="/vehicles/add">
            <Plus className="mr-2 h-4 w-4" />
            Add Vehicle
          </Link>
        </Button>
      </div>

      <div className="flex w-full max-w-2xl items-center space-x-2">
        <form className="relative flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              name="q"
              type="search"
              placeholder="Search vehicles..."
              className="pl-8"
              defaultValue={q}
            />
          </div>
          
          <div className="w-[180px]">
            <Select name="fuel" defaultValue={fuel}>
              <SelectTrigger>
                <SelectValue placeholder="Fuel Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="petrol">Petrol</SelectItem>
                <SelectItem value="diesel">Diesel</SelectItem>
                <SelectItem value="cng">CNG</SelectItem>
                <SelectItem value="electric">Electric</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button type="submit" variant="secondary">Filter</Button>
        </form>
      </div>

      {vehicles.length === 0 ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-dashed bg-muted/10 p-8 text-center animate-in fade-in-50">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted/50">
            <CarFront className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="mt-6 text-xl font-semibold">No vehicles found</h2>
          <p className="mt-2 text-center text-sm leading-6 text-muted-foreground max-w-sm">
            {q
              ? `No vehicles match your search for "${q}". Try a different term or clear the search.`
              : "You haven't added any vehicles yet. Add your first vehicle to start tracking maintenance and fuel."}
          </p>
          <div className="mt-6 flex gap-4">
            {q && (
              <Button variant="outline" asChild>
                <Link href="/vehicles">Clear Search</Link>
              </Button>
            )}
            <Button asChild>
              <Link href="/vehicles/add">
                <Plus className="mr-2 h-4 w-4" />
                Add Vehicle
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {vehicles.map((vehicle) => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
      )}
    </div>
  );
}
