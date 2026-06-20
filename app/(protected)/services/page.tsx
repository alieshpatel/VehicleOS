import { getServices } from "@/actions/services";
import { Button } from "@/components/ui/button";
import { Plus, Wrench, Download } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

export default async function ServicesPage() {
  const servicesList = await getServices();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Services</h1>
          <p className="text-muted-foreground">
            Track maintenance and repair history for all your vehicles.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <a href="/api/export/services">
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </a>
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Service
          </Button>
        </div>
      </div>

      <div className="rounded-xl border bg-card text-card-foreground shadow">
        {servicesList.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center p-8 text-center animate-in fade-in-50">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted/50 mb-4">
              <Wrench className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-lg font-semibold">No services recorded</h2>
            <p className="text-sm text-muted-foreground max-w-sm mt-2">
              Keep track of maintenance, repairs, and part replacements by adding a service record.
            </p>
            <Button className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Add Service
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Center</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="text-right">Cost</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {servicesList.map((service) => (
                <TableRow key={service.id}>
                  <TableCell>
                    {format(new Date(service.serviceDate), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="font-medium">{service.serviceType}</TableCell>
                  <TableCell>{service.serviceCenter || "-"}</TableCell>
                  <TableCell className="max-w-[200px] truncate text-muted-foreground">
                    {service.notes || "-"}
                  </TableCell>
                  <TableCell className="text-right">₹{service.cost.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
