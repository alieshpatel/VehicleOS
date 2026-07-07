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
import { Loader2, Sparkles, ScanLine } from "lucide-react";
import { toast } from "sonner";
import type { Vehicle } from "@/db/schema";

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

const SERVICE_TYPES = [
  "Regular Maintenance",
  "Oil Change",
  "Tyre Replacement/Rotation",
  "Brake Service",
  "Battery Replacement",
  "AC Service",
  "Major Repair",
  "Other",
] as const;

export default function AddServicePage() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  // Both Selects below are Radix components — they don't participate in native
  // FormData, so their values are held in React state and merged in on submit.
  const [vehicleId, setVehicleId] = useState("");
  const [serviceType, setServiceType] = useState<string>("");
  
  // Controlled inputs for AI Auto-fill
  const [serviceDate, setServiceDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [cost, setCost] = useState("");
  const [serviceCenter, setServiceCenter] = useState("");
  const [notes, setNotes] = useState("");
  const [isScanning, setIsScanning] = useState(false);

  const simulateAiScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setServiceType("Regular Maintenance");
      setCost("4500");
      setServiceCenter("GoMechanic Authorized Workshop");
      setNotes("Replaced engine oil, oil filter, and air filter. Full car wash.");
      toast.success("Invoice scanned! Data extracted successfully.", {
        icon: <Sparkles className="h-4 w-4 text-violet-500" />
      });
      setIsScanning(false);
    }, 1500);
  };

  useEffect(() => {
    async function load() {
      const v = await getVehicles();
      setVehicles(v);
    }
    load();
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!vehicleId) {
      toast.error("Please select a vehicle");
      return;
    }
    if (!serviceType) {
      toast.error("Please select a service type");
      return;
    }

    setIsPending(true);

    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        vehicleId,
        serviceDate: formData.get("serviceDate") as string,
        serviceType,
        cost: parseInt(formData.get("cost") as string),
        serviceCenter: (formData.get("serviceCenter") as string) || undefined,
        notes: (formData.get("notes") as string) || undefined,
      };

      await addService(data);
      toast.success("Service record added successfully!");
      router.push("/services");
    } catch (error) {
      console.error(error);
      const message = error instanceof Error ? error.message : "Failed to add service record. Please try again.";
      toast.error(message);
      setIsPending(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto w-full">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Add Service Record</CardTitle>
              <CardDescription>
                Log maintenance, repairs, or part replacements.
              </CardDescription>
            </div>
            <Button 
              type="button" 
              variant="secondary" 
              size="sm" 
              onClick={simulateAiScan}
              disabled={isScanning}
              className="h-9 gap-1.5 bg-violet-500/10 text-violet-600 hover:bg-violet-500/20 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 border border-violet-500/20 transition-all"
            >
              {isScanning ? (
                <ScanLine className="h-4 w-4 animate-pulse" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {isScanning ? "Scanning invoice..." : "AI Auto-fill"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="vehicleId">Vehicle</Label>
                <Select value={vehicleId} onValueChange={setVehicleId}>
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
                  value={serviceDate}
                  onChange={(e) => setServiceDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="serviceType">Service Type</Label>
                <Select value={serviceType} onValueChange={setServiceType}>
                  <SelectTrigger id="serviceType">
                    <SelectValue placeholder="e.g. Regular Maintenance" />
                  </SelectTrigger>
                  <SelectContent>
                    {SERVICE_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
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
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="serviceCenter">Service Center / Garage</Label>
                <Input
                  id="serviceCenter"
                  name="serviceCenter"
                  list="centers"
                  placeholder="Start typing or select a common garage..."
                  value={serviceCenter}
                  onChange={(e) => setServiceCenter(e.target.value)}
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
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
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