"use client";

import { getFuelLogs } from "@/actions/fuel-logs";
import { Button } from "@/components/ui/button";
import { Plus, Fuel, Download } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addFuelLog } from "@/actions/fuel-logs";
import { getVehicles } from "@/actions/vehicles";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function FuelLogsPage() {
  const [fuelLogsList, setFuelLogsList] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [vehicleId, setVehicleId] = useState("");

  useEffect(() => {
    async function load() {
      const logs = await getFuelLogs();
      setFuelLogsList(logs);
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
    setIsPending(true);
    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        vehicleId,
        litres: parseFloat(formData.get("litres") as string),
        amount: parseInt(formData.get("amount") as string),
        odometer: parseInt(formData.get("odometer") as string),
        date: formData.get("date") as string,
      };
      await addFuelLog(data);
      toast.success("Fuel log added!");
      setIsOpen(false);
      const logs = await getFuelLogs();
      setFuelLogsList(logs);
    } catch (err: any) {
      toast.error(err.message || "Failed to add fuel log");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fuel Logs</h1>
          <p className="text-muted-foreground">
            Log fuel entries and track your vehicle's mileage efficiency.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <a href="/api/export/fuel">
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </a>
          </Button>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Fuel Log
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Fuel Log</DialogTitle>
                <DialogDescription>Record your latest fuel fill-up to track mileage.</DialogDescription>
              </DialogHeader>
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Vehicle</Label>
                  <Select value={vehicleId} onValueChange={setVehicleId} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicles.map(v => (
                        <SelectItem key={v.id} value={v.id}>{v.brand} {v.model}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input name="date" type="date" required defaultValue={new Date().toISOString().split('T')[0]} />
                </div>
                <div className="space-y-2">
                  <Label>Litres</Label>
                  <Input name="litres" type="number" step="0.01" required placeholder="e.g. 15.5" />
                </div>
                <div className="space-y-2">
                  <Label>Total Amount (₹)</Label>
                  <Input name="amount" type="number" required placeholder="e.g. 1500" />
                </div>
                <div className="space-y-2">
                  <Label>Current Odometer (km)</Label>
                  <Input name="odometer" type="number" required placeholder="e.g. 25400" />
                </div>
                <div className="flex justify-end pt-4">
                  <Button type="submit" disabled={isPending}>
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Log
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow">
        {fuelLogsList.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center p-8 text-center animate-in fade-in-50">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted/50 mb-4">
              <Fuel className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold">No fuel logs found</h2>
            <p className="text-sm text-muted-foreground max-w-sm mt-2">
              Start logging your fuel fill-ups to automatically calculate mileage and track expenses.
            </p>
            <Button className="mt-4" onClick={() => setIsOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Fuel Log
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Odometer</TableHead>
                <TableHead>Litres</TableHead>
                <TableHead>Efficiency</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fuelLogsList.map((log, index) => {
                // Calculate mileage (km/l) compared to previous log for same vehicle
                // This is a simplified calculation for display purposes
                let efficiency = "-";
                const prevLog = fuelLogsList
                  .slice(index + 1)
                  .find((l) => l.vehicleId === log.vehicleId);
                  
                if (prevLog && prevLog.odometer < log.odometer) {
                  const km = log.odometer - prevLog.odometer;
                  efficiency = (km / log.litres).toFixed(1) + " km/l";
                }

                return (
                  <TableRow key={log.id}>
                    <TableCell>
                      {format(new Date(log.date), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>{log.odometer.toLocaleString()} km</TableCell>
                    <TableCell>{log.litres.toFixed(2)} L</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        {efficiency}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ₹{log.amount.toLocaleString()}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
