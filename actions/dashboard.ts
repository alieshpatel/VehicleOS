"use server";

import { db } from "@/db";
import { vehicles, services, fuelLogs, reminders } from "@/db/schema";
import { getCurrentUser } from "@/actions/users";
import { eq, and, inArray, desc } from "drizzle-orm";

export async function getDashboardStats() {
  const user = await getCurrentUser();

  // Get user's vehicles
  const userVehicles = await db
    .select()
    .from(vehicles)
    .where(eq(vehicles.userId, user.id));

  if (!userVehicles.length) {
    return {
      totalVehicles: 0,
      upcomingServices: 0,
      fuelExpensesThisMonth: 0,
      activeReminders: 0,
    };
  }

  const vehicleIds = userVehicles.map((v) => v.id);

  // Count upcoming services (within next 30 days — just count recent services for now)
  const allServices = await db
    .select()
    .from(services)
    .where(inArray(services.vehicleId, vehicleIds));

  // Fuel expenses this month
  const now = new Date();
  const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
  const allFuelLogs = await db
    .select()
    .from(fuelLogs)
    .where(inArray(fuelLogs.vehicleId, vehicleIds));
  const fuelExpensesThisMonth = allFuelLogs
    .filter((f) => f.date >= monthStart)
    .reduce((sum, f) => sum + f.amount, 0);

  // Active reminders (not completed)
  const allReminders = await db
    .select()
    .from(reminders)
    .where(inArray(reminders.vehicleId, vehicleIds));
  const activeReminders = allReminders.filter((r) => !r.completed).length;

  return {
    totalVehicles: userVehicles.length,
    upcomingServices: allServices.length,
    fuelExpensesThisMonth,
    activeReminders,
  };
}

export async function getMonthlyMaintenanceCosts() {
  const user = await getCurrentUser();
  const userVehicles = await db
    .select({ id: vehicles.id })
    .from(vehicles)
    .where(eq(vehicles.userId, user.id));

  if (!userVehicles.length) return [];

  const vehicleIds = userVehicles.map((v) => v.id);
  const allServices = await db
    .select()
    .from(services)
    .where(inArray(services.vehicleId, vehicleIds))
    .orderBy(services.serviceDate);

  // Group by month
  const monthlyData: Record<string, number> = {};
  for (const s of allServices) {
    const month = s.serviceDate.substring(0, 7); // YYYY-MM
    monthlyData[month] = (monthlyData[month] || 0) + s.cost;
  }

  return Object.entries(monthlyData).map(([month, total]) => ({
    month,
    total,
  }));
}

export async function getVehicleCostComparison() {
  const user = await getCurrentUser();
  const userVehicles = await db
    .select({ id: vehicles.id, brand: vehicles.brand, model: vehicles.model, vehicleNumber: vehicles.vehicleNumber })
    .from(vehicles)
    .where(eq(vehicles.userId, user.id));

  if (!userVehicles.length) return [];

  const vehicleIds = userVehicles.map((v) => v.id);
  
  // Get all services and fuel logs
  const allServices = await db
    .select()
    .from(services)
    .where(inArray(services.vehicleId, vehicleIds));
    
  const allFuelLogs = await db
    .select()
    .from(fuelLogs)
    .where(inArray(fuelLogs.vehicleId, vehicleIds));

  // Aggregate by vehicle
  return userVehicles.map(v => {
    const vServices = allServices.filter(s => s.vehicleId === v.id);
    const vFuelLogs = allFuelLogs.filter(f => f.vehicleId === v.id);
    
    const serviceCost = vServices.reduce((sum, s) => sum + s.cost, 0);
    const fuelCost = vFuelLogs.reduce((sum, f) => sum + f.amount, 0);
    
    return {
      name: `${v.brand} ${v.model}`,
      maintenance: serviceCost,
      fuel: fuelCost,
      total: serviceCost + fuelCost
    };
  }).sort((a, b) => b.total - a.total); // Sort highest cost first
}
