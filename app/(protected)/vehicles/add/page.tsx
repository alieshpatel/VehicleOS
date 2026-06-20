"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addVehicle } from "@/actions/vehicles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function AddVehiclePage() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);

    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        vehicleNumber: formData.get("vehicleNumber") as string,
        brand: formData.get("brand") as string,
        model: formData.get("model") as string,
        year: parseInt(formData.get("year") as string),
        fuelType: formData.get("fuelType") as "petrol" | "diesel" | "cng" | "electric" | "hybrid",
        mileage: parseInt(formData.get("mileage") as string),
      };

      await addVehicle(data);
      toast.success("Vehicle added successfully!");
      router.push("/vehicles");
    } catch (error) {
      console.error(error);
      toast.error("Failed to add vehicle. Please try again.");
      setIsPending(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto w-full">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Add New Vehicle</CardTitle>
          <CardDescription>
            Enter your vehicle details to start tracking maintenance and fuel logs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <Input id="brand" name="brand" placeholder="e.g. Honda" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Input id="model" name="model" placeholder="e.g. Civic" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  name="year"
                  type="number"
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  placeholder="e.g. 2020"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vehicleNumber">Registration Number</Label>
                <Input
                  id="vehicleNumber"
                  name="vehicleNumber"
                  placeholder="e.g. MH-12-AB-1234"
                  required
                  className="uppercase"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fuelType">Fuel Type</Label>
                <Select name="fuelType" required defaultValue="petrol">
                  <SelectTrigger id="fuelType">
                    <SelectValue placeholder="Select fuel type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="petrol">Petrol</SelectItem>
                    <SelectItem value="diesel">Diesel</SelectItem>
                    <SelectItem value="cng">CNG</SelectItem>
                    <SelectItem value="electric">Electric</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="mileage">Current Odometer (km)</Label>
                <Input
                  id="mileage"
                  name="mileage"
                  type="number"
                  min="0"
                  placeholder="e.g. 15000"
                  required
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isPending}
                className="w-full"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending} className="w-full">
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Vehicle
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
