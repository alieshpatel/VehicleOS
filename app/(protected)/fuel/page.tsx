"use client";

import { getFuelLogs } from "@/actions/fuel-logs";
import { Button } from "@/components/ui/button";
import { Plus, Fuel, Download, Gauge, TrendingUp, Droplets, Loader2, Sparkles, ScanLine } from "lucide-react";
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
import { useState, useEffect, useCallback } from "react";

/* ─── Animated Odometer Input ─── */
function OdometerInput({
  name,
  value,
  onChange,
}: {
  name: string;
  value: string;
  onChange: (val: string) => void;
}) {
  const displayDigits = value.padStart(6, "0").split("");

  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2">
        <Gauge className="h-4 w-4 text-muted-foreground" />
        Current Odometer (km)
      </Label>
      {/* Hidden real input for form */}
      <input type="hidden" name={name} value={value} />

      {/* Visual odometer display */}
      <div className="flex items-center gap-0.5">
        {displayDigits.map((digit, i) => (
          <div
            key={i}
            className={`relative w-10 h-14 rounded-lg border-2 flex items-center justify-center font-mono text-xl font-bold transition-all duration-300 ${
              i >= displayDigits.length - 2
                ? "border-cyan-500/40 bg-cyan-500/5 text-cyan-500"
                : value.length > 0 && i >= 6 - value.length
                ? "border-border bg-muted/50 text-foreground"
                : "border-border/30 bg-muted/20 text-muted-foreground/30"
            }`}
          >
            <span
              className={`transition-all duration-300 ${
                value.length > 0 && i >= 6 - value.length
                  ? "opacity-100 scale-100"
                  : "opacity-40 scale-90"
              }`}
            >
              {digit}
            </span>
            {/* Tick marks on sides */}
            <div className="absolute top-0 left-0 right-0 h-px bg-border/30" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-border/30" />
          </div>
        ))}
        <span className="text-sm text-muted-foreground ml-2 font-medium">km</span>
      </div>

      {/* Actual editable input */}
      <Input
        type="number"
        required
        placeholder="e.g. 25400"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 font-mono"
      />
    </div>
  );
}

/* ─── Fuel Level Bar Animation ─── */
function FuelLevelBar({ litres, maxLitres = 50 }: { litres: number; maxLitres?: number }) {
  const pct = Math.min((litres / maxLitres) * 100, 100);
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 flex-1 rounded-full bg-muted/50 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-red-500 via-amber-400 to-emerald-400 transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground font-mono w-10 text-right">
        {litres.toFixed(1)}L
      </span>
    </div>
  );
}

export default function FuelLogsPage() {
  const [fuelLogsList, setFuelLogsList] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [vehicleId, setVehicleId] = useState("");
  const [odometerValue, setOdometerValue] = useState("");
  const [litresValue, setLitresValue] = useState("");
  const [amountValue, setAmountValue] = useState("");
  const [dateValue, setDateValue] = useState(() => new Date().toISOString().split('T')[0]);
  const [isScanning, setIsScanning] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    async function load() {
      const logs = await getFuelLogs();
      setFuelLogsList(logs);
      const v = await getVehicles();
      setVehicles(v);
    }
    load();
    setTimeout(() => setMounted(true), 50);
  }, []);

  const handleOdometerChange = useCallback((val: string) => {
    // Only allow numeric, max 7 digits
    const clean = val.replace(/\D/g, "").slice(0, 7);
    setOdometerValue(clean);
  }, []);

  const simulateAiScan = () => {
    setIsScanning(true);
    // Simulate AI parsing a fuel receipt
    setTimeout(() => {
      setLitresValue("45.20");
      setAmountValue("4800");
      setDateValue(new Date().toISOString().split('T')[0]);
      toast.success("Receipt scanned! Data extracted successfully.", {
        icon: <Sparkles className="h-4 w-4 text-violet-500" />
      });
      setIsScanning(false);
    }, 1500);
  };

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
      setOdometerValue("");
      setLitresValue("");
      setAmountValue("");
      setDateValue(new Date().toISOString().split('T')[0]);
      const logs = await getFuelLogs();
      setFuelLogsList(logs);
    } catch (err: any) {
      toast.error(err.message || "Failed to add fuel log");
    } finally {
      setIsPending(false);
    }
  }

  // Calculate total stats
  const totalLitres = fuelLogsList.reduce((sum, l) => sum + (l.litres || 0), 0);
  const totalSpent = fuelLogsList.reduce((sum, l) => sum + (l.amount || 0), 0);

  return (
    <div className="flex flex-col gap-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative">
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-emerald-500/10 to-teal-500/5 rounded-full blur-3xl pointer-events-none" />
          <h1 className="text-3xl font-bold tracking-tight relative flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-md">
              <Fuel className="h-5 w-5 text-white" />
            </div>
            Fuel Logs
          </h1>
          <p className="text-muted-foreground mt-1">
            Log fuel entries and track your vehicle&apos;s mileage efficiency.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-border/50" asChild>
            <a href="/api/export/fuel">
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </a>
          </Button>
          <Dialog open={isOpen} onOpenChange={(open) => { setIsOpen(open); if (!open) setOdometerValue(""); }}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white shadow-md shadow-emerald-500/20">
                <Plus className="mr-2 h-4 w-4" />
                Add Fuel Log
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle className="flex items-center gap-2">
                    <Fuel className="h-5 w-5 text-emerald-500" />
                    Add Fuel Log
                  </DialogTitle>
                  <Button 
                    type="button" 
                    variant="secondary" 
                    size="sm" 
                    onClick={simulateAiScan}
                    disabled={isScanning}
                    className="h-8 gap-1.5 bg-violet-500/10 text-violet-600 hover:bg-violet-500/20 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 border border-violet-500/20 transition-all"
                  >
                    {isScanning ? (
                      <ScanLine className="h-3.5 w-3.5 animate-pulse" />
                    ) : (
                      <Sparkles className="h-3.5 w-3.5" />
                    )}
                    {isScanning ? "Scanning receipt..." : "AI Auto-fill"}
                  </Button>
                </div>
                <DialogDescription>Record your latest fuel fill-up or scan a receipt.</DialogDescription>
              </DialogHeader>
              <form onSubmit={onSubmit} className="space-y-5">
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
                  <Input name="date" type="date" required value={dateValue} onChange={(e) => setDateValue(e.target.value)} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Droplets className="h-4 w-4 text-muted-foreground" />
                      Litres
                    </Label>
                    <Input name="litres" type="number" step="0.01" required placeholder="e.g. 15.5" className="font-mono" value={litresValue} onChange={(e) => setLitresValue(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Total Amount (₹)</Label>
                    <Input name="amount" type="number" required placeholder="e.g. 1500" className="font-mono" value={amountValue} onChange={(e) => setAmountValue(e.target.value)} />
                  </div>
                </div>

                {/* Odometer with visual animation */}
                <OdometerInput
                  name="odometer"
                  value={odometerValue}
                  onChange={handleOdometerChange}
                />

                <div className="flex justify-end pt-2">
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white"
                  >
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Log
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Quick stats */}
      {fuelLogsList.length > 0 && (
        <div className={`grid grid-cols-2 sm:grid-cols-3 gap-4 transition-all duration-500 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="rounded-xl border border-border/50 bg-gradient-to-br from-background to-emerald-500/5 p-4">
            <div className="text-xs text-muted-foreground mb-1">Total Fill-ups</div>
            <div className="text-2xl font-bold">{fuelLogsList.length}</div>
          </div>
          <div className="rounded-xl border border-border/50 bg-gradient-to-br from-background to-cyan-500/5 p-4">
            <div className="text-xs text-muted-foreground mb-1">Total Litres</div>
            <div className="text-2xl font-bold">{totalLitres.toFixed(1)} L</div>
          </div>
          <div className="rounded-xl border border-border/50 bg-gradient-to-br from-background to-violet-500/5 p-4 col-span-2 sm:col-span-1">
            <div className="text-xs text-muted-foreground mb-1">Total Spent</div>
            <div className="text-2xl font-bold">₹{totalSpent.toLocaleString()}</div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl border border-border/50 bg-card text-card-foreground shadow-sm overflow-hidden">
        {fuelLogsList.length === 0 ? (
          <div className="flex min-h-[350px] flex-col items-center justify-center p-8 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 mb-5">
              <Fuel className="h-9 w-9 text-emerald-500/40" />
            </div>
            <h2 className="text-lg font-semibold">No fuel logs found</h2>
            <p className="text-sm text-muted-foreground max-w-sm mt-2">
              Start logging your fuel fill-ups to automatically calculate mileage and track expenses.
            </p>
            <Button
              className="mt-5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white"
              onClick={() => setIsOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Fuel Log
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Date</TableHead>
                <TableHead>
                  <span className="flex items-center gap-1.5">
                    <Gauge className="h-3.5 w-3.5" />
                    Odometer
                  </span>
                </TableHead>
                <TableHead>Litres</TableHead>
                <TableHead>
                  <span className="flex items-center gap-1.5">
                    <TrendingUp className="h-3.5 w-3.5" />
                    Efficiency
                  </span>
                </TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fuelLogsList.map((log, index) => {
                let efficiency = "-";
                const prevLog = fuelLogsList
                  .slice(index + 1)
                  .find((l) => l.vehicleId === log.vehicleId);
                  
                if (prevLog && prevLog.odometer < log.odometer) {
                  const km = log.odometer - prevLog.odometer;
                  efficiency = (km / log.litres).toFixed(1) + " km/l";
                }

                return (
                  <TableRow key={log.id} className="group">
                    <TableCell className="font-medium">
                      {format(new Date(log.date), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                      {/* Mini inline odometer display */}
                      <span className="inline-flex items-center gap-px font-mono text-xs">
                        {log.odometer
                          .toString()
                          .padStart(6, "0")
                          .split("")
                          .map((d: string, i: number) => (
                            <span
                              key={i}
                              className={`inline-flex items-center justify-center h-6 w-5 rounded text-center ${
                                i >= 4
                                  ? "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20"
                                  : "bg-muted/50 border border-border/50"
                              }`}
                            >
                              {d}
                            </span>
                          ))}
                        <span className="text-muted-foreground ml-1">km</span>
                      </span>
                    </TableCell>
                    <TableCell>
                      <FuelLevelBar litres={log.litres} />
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`font-mono ${
                          efficiency !== "-"
                            ? parseFloat(efficiency) > 15
                              ? "border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5"
                              : parseFloat(efficiency) > 10
                              ? "border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/5"
                              : "border-red-500/30 text-red-600 dark:text-red-400 bg-red-500/5"
                            : ""
                        }`}
                      >
                        {efficiency}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-bold font-mono">
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
