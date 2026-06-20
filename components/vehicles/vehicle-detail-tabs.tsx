"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wrench, Fuel, FileText, Bell, Stethoscope } from "lucide-react";

interface VehicleDetailTabsProps {
  vehicleId: string;
}

export function VehicleDetailTabs({ vehicleId }: VehicleDetailTabsProps) {
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
          <p className="text-muted-foreground">Services list will go here.</p>
        </div>
      </TabsContent>

      <TabsContent value="fuel" className="mt-6">
        <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
          <p className="text-muted-foreground">Fuel logs will go here.</p>
        </div>
      </TabsContent>

      <TabsContent value="documents" className="mt-6">
        <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
          <p className="text-muted-foreground">Documents will go here.</p>
        </div>
      </TabsContent>

      <TabsContent value="reminders" className="mt-6">
        <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
          <p className="text-muted-foreground">Reminders will go here.</p>
        </div>
      </TabsContent>

      <TabsContent value="ai-diagnosis" className="mt-6">
        <div className="rounded-xl border bg-card text-card-foreground shadow p-6">
          <p className="text-muted-foreground">AI Diagnosis history will go here.</p>
        </div>
      </TabsContent>
    </Tabs>
  );
}
