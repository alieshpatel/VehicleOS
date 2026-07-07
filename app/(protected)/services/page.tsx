import { getServices } from "@/actions/services";
import { Button } from "@/components/ui/button";
import { Plus, Wrench, Download, Calendar, MapPin, FileText } from "lucide-react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default async function ServicesPage() {
  const servicesList = await getServices();

  // Calculate totals
  const totalCost = servicesList.reduce((sum, s) => sum + (s.cost || 0), 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative">
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-orange-500/10 to-amber-500/5 rounded-full blur-3xl pointer-events-none" />
          <h1 className="text-3xl font-bold tracking-tight relative flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-md">
              <Wrench className="h-5 w-5 text-white" />
            </div>
            Services
          </h1>
          <p className="text-muted-foreground mt-1">
            Track maintenance and repair history for all your vehicles.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-border/50" asChild>
            <a href="/api/export/services">
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </a>
          </Button>
          <Button className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-md shadow-orange-500/20" asChild>
            <Link href="/services/add">
              <Plus className="mr-2 h-4 w-4" />
              Add Service
            </Link>
          </Button>
        </div>
      </div>

      {/* Quick stats */}
      {servicesList.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl border border-border/50 bg-gradient-to-br from-background to-orange-500/5 p-4">
            <div className="text-xs text-muted-foreground mb-1">Total Services</div>
            <div className="text-2xl font-bold">{servicesList.length}</div>
          </div>
          <div className="rounded-xl border border-border/50 bg-gradient-to-br from-background to-amber-500/5 p-4">
            <div className="text-xs text-muted-foreground mb-1">Total Spent</div>
            <div className="text-2xl font-bold">₹{totalCost.toLocaleString()}</div>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-border/50 bg-card text-card-foreground shadow-sm overflow-hidden">
        {servicesList.length === 0 ? (
          <div className="flex min-h-[350px] flex-col items-center justify-center p-8 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-orange-500/10 to-amber-500/10 border border-orange-500/20 mb-5">
              <Wrench className="h-9 w-9 text-orange-500/40" />
            </div>
            <h2 className="text-lg font-semibold">No services recorded</h2>
            <p className="text-sm text-muted-foreground max-w-sm mt-2">
              Keep track of maintenance, repairs, and part replacements by adding a service record.
            </p>
            <Button className="mt-5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white" asChild>
              <Link href="/services/add">
                <Plus className="mr-2 h-4 w-4" />
                Add Service
              </Link>
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    Date
                  </span>
                </TableHead>
                <TableHead>
                  <span className="flex items-center gap-1.5">
                    <Wrench className="h-3.5 w-3.5" />
                    Type
                  </span>
                </TableHead>
                <TableHead>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    Center
                  </span>
                </TableHead>
                <TableHead>
                  <span className="flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5" />
                    Notes
                  </span>
                </TableHead>
                <TableHead className="text-right">Cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {servicesList.map((service) => (
                <TableRow key={service.id} className="group">
                  <TableCell className="font-medium">
                    {format(new Date(service.serviceDate), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-orange-500/20 bg-orange-500/5 text-orange-600 dark:text-orange-400">
                      {service.serviceType}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{service.serviceCenter || "-"}</TableCell>
                  <TableCell className="max-w-[200px] truncate text-muted-foreground">
                    {service.notes || "-"}
                  </TableCell>
                  <TableCell className="text-right font-bold font-mono">
                    ₹{service.cost.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
