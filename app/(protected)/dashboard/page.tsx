import {
  getDashboardStats,
  getMonthlyMaintenanceCosts,
} from "@/actions/dashboard";
import { getMonthlyFuelExpenses } from "@/actions/fuel-logs";
import { getCurrentUser } from "@/actions/users";
import { getUpcomingReminders } from "@/actions/reminders";
import { FuelChart } from "@/components/dashboard/fuel-chart";
import { MaintenanceChart } from "@/components/dashboard/maintenance-chart";
import { CostComparisonChart } from "@/components/dashboard/cost-comparison-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, Wrench, Fuel, Bell, ArrowRight } from "lucide-react";
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
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user.name.split(" ")[0]}. Here's an overview of your vehicles.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-primary/10 shadow-sm bg-gradient-to-br from-background to-muted/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Vehicles
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Car className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalVehicles}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Registered in your garage
            </p>
          </CardContent>
        </Card>
        <Card className="border-primary/10 shadow-sm bg-gradient-to-br from-background to-muted/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Upcoming Services
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Wrench className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.upcomingServices}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Logged maintenance records
            </p>
          </CardContent>
        </Card>
        <Card className="border-primary/10 shadow-sm bg-gradient-to-br from-background to-muted/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Fuel Expenses (This Month)
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Fuel className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              ₹{stats.fuelExpensesThisMonth.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all vehicles
            </p>
          </CardContent>
        </Card>
        <Card className="border-primary/10 shadow-sm bg-gradient-to-br from-background to-muted/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Reminders
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Bell className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.activeReminders}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Pending tasks
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <div className="lg:col-span-5 grid gap-6 md:grid-cols-2">
          <FuelChart data={fuelData} />
          <MaintenanceChart data={maintenanceData} />
        </div>
        <div className="lg:col-span-2">
          <Card className="h-full border-primary/10 shadow-sm flex flex-col">
            <CardHeader>
              <CardTitle>Priority Reminders</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto">
              {upcomingReminders.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                    <Bell className="h-6 w-6 text-muted-foreground opacity-50" />
                  </div>
                  <p className="text-sm text-muted-foreground">You're all caught up!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingReminders.map((reminder) => (
                    <div
                      key={reminder.id}
                      className="flex items-center gap-3 border-b pb-3 last:border-0 last:pb-0"
                    >
                      <div
                        className={`h-2 w-2 rounded-full ${
                          reminder.status === "overdue"
                            ? "bg-destructive"
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
              <Button variant="outline" className="w-full text-xs h-8" asChild>
                <Link href="/reminders">
                  View All Reminders
                  <ArrowRight className="ml-2 h-3 w-3" />
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 mt-6">
        <div className="lg:col-span-7">
          <CostComparisonChart data={costComparison} />
        </div>
      </div>
    </div>
  );
}
