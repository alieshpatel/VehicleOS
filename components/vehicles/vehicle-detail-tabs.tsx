"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wrench, Fuel, FileText, Bell, Stethoscope, Download } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface VehicleDetailTabsProps {
  vehicleId: string;
  services: any[];
  fuelLogs: any[];
  documents: any[];
  reminders: any[];
  aiReports: any[];
}

export function VehicleDetailTabs({ vehicleId, services, fuelLogs, documents, reminders, aiReports }: VehicleDetailTabsProps) {
  let averageMileage = null;
  if (fuelLogs && fuelLogs.length > 1) {
    const sortedLogs = [...fuelLogs].sort((a, b) => a.odometer - b.odometer);
    const totalDistance = sortedLogs[sortedLogs.length - 1].odometer - sortedLogs[0].odometer;
    const totalFuel = sortedLogs.slice(1).reduce((acc, log) => acc + Number(log.litres), 0);
    if (totalFuel > 0 && totalDistance > 0) {
      averageMileage = (totalDistance / totalFuel).toFixed(2);
    }
  }

  return (
    <Tabs defaultValue="services" className="w-full">
      <div className="overflow-x-auto pb-2">
        <TabsList className="w-full justify-start inline-flex min-w-max">
          <TabsTrigger value="services" className="gap-2">
            <Wrench className="h-4 w-4" />
            Services
          </TabsTrigger>
          <TabsTrigger value="fuel" className="gap-2">
            <Fuel className="h-4 w-4" />
            Fuel Logs
          </TabsTrigger>
          <TabsTrigger value="documents" className="gap-2">
            <FileText className="h-4 w-4" />
            Documents
          </TabsTrigger>
          <TabsTrigger value="reminders" className="gap-2">
            <Bell className="h-4 w-4" />
            Reminders
          </TabsTrigger>
          <TabsTrigger value="ai-diagnosis" className="gap-2">
            <Stethoscope className="h-4 w-4" />
            AI Diagnosis
          </TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="services" className="mt-6">
        <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
          {services.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No service records found.</p>
          ) : (
            <div className="space-y-4">
              {services.map(s => (
                <div key={s.id} className="flex justify-between items-center border-b pb-2 last:border-0">
                  <div>
                    <p className="font-medium">{s.serviceType}</p>
                    <p className="text-sm text-muted-foreground">{format(new Date(s.serviceDate), "MMM d, yyyy")} • {s.serviceCenter}</p>
                  </div>
                  <p className="font-semibold">₹{s.cost}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="fuel" className="mt-6">
        <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
          {averageMileage && (
            <div className="mb-6 p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-4">
              <div className="bg-emerald-500/20 p-3 rounded-full">
                <Fuel className="h-6 w-6 text-emerald-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground font-medium">Average Mileage</p>
                <p className="text-2xl font-bold text-emerald-500">{averageMileage} <span className="text-base font-normal text-emerald-500/70">km/l</span></p>
              </div>
            </div>
          )}
          {fuelLogs.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No fuel logs found.</p>
          ) : (
            <div className="space-y-4">
              {fuelLogs.map(f => (
                <div key={f.id} className="flex justify-between items-center border-b pb-2 last:border-0">
                  <div>
                    <p className="font-medium">{f.litres} Litres at {f.odometer} km</p>
                    <p className="text-sm text-muted-foreground">{format(new Date(f.date), "MMM d, yyyy")}</p>
                  </div>
                  <p className="font-semibold">₹{f.amount}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="documents" className="mt-6">
        <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
          {documents.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No documents found.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center gap-4 p-3 border rounded-lg">
                  <FileText className="h-5 w-5 text-primary" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{doc.fileName}</p>
                    <Badge variant="outline" className="text-[10px]">{doc.documentType}</Badge>
                  </div>
                  <Button variant="ghost" size="icon" asChild>
                    <a href={doc.fileUrl} target="_blank" rel="noreferrer">
                      <Download className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="reminders" className="mt-6">
        <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
          {reminders.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No reminders found.</p>
          ) : (
            <div className="space-y-4">
              {reminders.map(r => (
                <div key={r.id} className="flex justify-between items-center border-b pb-2 last:border-0">
                  <div>
                    <p className="font-medium">{r.title}</p>
                    <p className="text-sm text-muted-foreground">Due: {format(new Date(r.dueDate), "MMM d, yyyy")}</p>
                  </div>
                  <Badge variant={r.status === "overdue" ? "destructive" : "secondary"}>
                    {r.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="ai-diagnosis" className="mt-6">
        <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
          {aiReports.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No diagnosis history found.</p>
          ) : (
            <div className="space-y-6">
              {aiReports.map(report => (
                <div key={report.id} className="border-b pb-4 last:border-0">
                  <p className="text-sm text-muted-foreground mb-2">
                    {format(new Date(report.createdAt), "MMM d, yyyy")}
                  </p>
                  <p className="font-medium mb-2">Symptoms: "{report.symptoms}"</p>
                  <div className="bg-muted p-3 rounded-md">
                    <p className="text-sm font-semibold text-primary">Diagnosis: {report.diagnosis.recommendation}</p>
                    <p className="text-sm mt-1">Est. Cost: ₹{report.diagnosis.estimatedCostMin} - ₹{report.diagnosis.estimatedCostMax}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}
