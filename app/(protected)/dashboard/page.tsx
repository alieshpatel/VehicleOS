import {
  getDashboardStats,
  getMonthlyMaintenanceCosts,
  getVehicleCostComparison,
} from "@/actions/dashboard";
import { getMonthlyFuelExpenses } from "@/actions/fuel-logs";
import { getCurrentUser } from "@/actions/users";
import { getUpcomingReminders } from "@/actions/reminders";
import { FuelChart } from "@/components/dashboard/fuel-chart";
import { MaintenanceChart } from "@/components/dashboard/maintenance-chart";
import { CostComparisonChart } from "@/components/dashboard/cost-comparison-chart";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  // Ensure the user exists in our DB first (inline fallback if webhook was slow)
  const user = await getCurrentUser();

  const [stats, fuelData, maintenanceData, upcomingReminders, costComparison] = await Promise.all([
    getDashboardStats(),
    getMonthlyFuelExpenses(),
    getMonthlyMaintenanceCosts(),
    getUpcomingReminders(),
    getVehicleCostComparison(),
  ]);

  return (
    <div className="flex flex-col gap-6">
      {/* Page header with gradient accent */}
      <div className="relative">
        <div className="absolute -top-6 -left-6 w-32 h-32 bg-gradient-to-br from-violet-500/10 to-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
        <h1 className="text-3xl font-bold tracking-tight relative">
          Dashboard
        </h1>
        <p className="text-muted-foreground relative">
          Welcome back, {user.name.split(" ")[0]}. Here&apos;s your vehicle overview.
        </p>
      </div>

      {/* Animated stat cards — client component */}
      <DashboardStats stats={stats} />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-5 grid gap-6 md:grid-cols-2">
          <FuelChart data={fuelData} />
          <MaintenanceChart data={maintenanceData} />
        </div>
        <div className="lg:col-span-2">
          <Card className="h-full border-border/50 shadow-sm flex flex-col bg-gradient-to-br from-background to-muted/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-amber-500" />
                Priority Reminders
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto">
              {upcomingReminders.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="h-14 w-14 rounded-full bg-gradient-to-br from-emerald-500/10 to-teal-500/10 flex items-center justify-center mb-3 border border-emerald-500/20">
                    <Bell className="h-6 w-6 text-emerald-500/50" />
                  </div>
                  <p className="text-sm font-medium text-foreground">All caught up!</p>
                  <p className="text-xs text-muted-foreground mt-1">No upcoming reminders</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingReminders.map((reminder) => (
                    <div
                      key={reminder.id}
                      className="flex items-center gap-3 p-2.5 rounded-lg border border-border/50 bg-background/50 hover:bg-muted/30 transition-colors duration-200"
                    >
                      <div
                        className={`h-2.5 w-2.5 rounded-full shrink-0 ${
                          reminder.status === "overdue"
                            ? "bg-red-500 animate-pulse"
                            : "bg-amber-500"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium leading-none truncate">
                          {reminder.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Due: {new Date(reminder.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
            <div className="p-4 pt-0 mt-auto">
              <Button variant="outline" className="w-full text-xs h-8 border-border/50" asChild>
                <Link href="/reminders">
                  View All Reminders
                  <ArrowRight className="ml-2 h-3 w-3" />
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 mt-2">
        <div className="lg:col-span-7">
          <CostComparisonChart data={costComparison} />
        </div>
      </div>
    </div>
  );
}
