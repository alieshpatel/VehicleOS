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
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export default async function FuelLogsPage() {
  const fuelLogsList = await getFuelLogs();

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
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Fuel Log
          </Button>
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
            <Button className="mt-4">
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
