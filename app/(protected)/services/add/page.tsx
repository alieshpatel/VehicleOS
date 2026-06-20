"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { addService } from "@/actions/services";
import { getVehicles } from "@/actions/vehicles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

// Static service center suggestions
const COMMON_SERVICE_CENTERS = [
  "GoMechanic Authorized Workshop",
  "Bosch Car Service",
  "MyTVS",
  "Mahindra First Choice",
  "Carnation Auto",
  "Authorized Dealer Service Center",
  "Local Independent Garage"
];

export default function AddServicePage() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [vehicles, setVehicles] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const v = await getVehicles();
      setVehicles(v);
    }
    load();
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);

    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        vehicleId: formData.get("vehicleId") as string,
        serviceDate: formData.get("serviceDate") as string,
        serviceType: formData.get("serviceType") as string,
        cost: parseInt(formData.get("cost") as string),
        serviceCenter: formData.get("serviceCenter") as string,
        notes: formData.get("notes") as string,
      };

      if (!data.vehicleId) {
        toast.error("Please select a vehicle");
        setIsPending(false);
        return;
      }

      await addService(data);
      toast.success("Service record added successfully!");
      router.push("/services");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to add service record. Please try again.");
      setIsPending(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto w-full">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Add Service Record</CardTitle>
          <CardDescription>
            Log maintenance, repairs, or part replacements.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="vehicleId">Vehicle</Label>
                <Select name="vehicleId" required>
                  <SelectTrigger id="vehicleId">
                    <SelectValue placeholder="Select vehicle" />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicles.map((v) => (
                      <SelectItem key={v.id} value={v.id}>
                        {v.brand} {v.model} ({v.vehicleNumber})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="serviceDate">Service Date</Label>
                <Input
                  id="serviceDate"
                  name="serviceDate"
                  type="date"
                  required
                  defaultValue={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="serviceType">Service Type</Label>
                <Select name="serviceType" required>
                  <SelectTrigger id="serviceType">
                    <SelectValue placeholder="e.g. Regular Maintenance" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Regular Maintenance">Regular Maintenance</SelectItem>
                    <SelectItem value="Oil Change">Oil Change</SelectItem>
                    <SelectItem value="Tyre Replacement/Rotation">Tyre Replacement/Rotation</SelectItem>
                    <SelectItem value="Brake Service">Brake Service</SelectItem>
                    <SelectItem value="Battery Replacement">Battery Replacement</SelectItem>
                    <SelectItem value="AC Service">AC Service</SelectItem>
                    <SelectItem value="Major Repair">Major Repair</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cost">Total Cost (₹)</Label>
                <Input
                  id="cost"
                  name="cost"
                  type="number"
                  min="0"
                  placeholder="e.g. 4500"
                  required
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="serviceCenter">Service Center / Garage</Label>
                <Input
                  id="serviceCenter"
                  name="serviceCenter"
                  list="centers"
                  placeholder="Start typing or select a common garage..."
                />
                <datalist id="centers">
                  {COMMON_SERVICE_CENTERS.map((center) => (
                    <option key={center} value={center} />
                  ))}
                </datalist>
                <p className="text-xs text-muted-foreground mt-1">Select from suggestions or type your own.</p>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="notes">Notes / Parts Replaced</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  placeholder="e.g. Replaced engine oil, oil filter, and air filter. Next service due at 45,000 km."
                  className="min-h-[100px]"
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
                Save Record
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
