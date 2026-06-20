"use server";

import { db } from "@/db";
import { fuelLogs, vehicles } from "@/db/schema";
import { getCurrentUser } from "@/actions/users";
import { eq, and, desc, inArray, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getFuelLogs(vehicleId?: string) {
  const user = await getCurrentUser();

  if (vehicleId) {
    const vehicle = await db
      .select()
      .from(vehicles)
      .where(and(eq(vehicles.id, vehicleId), eq(vehicles.userId, user.id)))
      .limit(1);
    if (!vehicle.length) return [];

    return db
      .select()
      .from(fuelLogs)
      .where(eq(fuelLogs.vehicleId, vehicleId))
      .orderBy(desc(fuelLogs.date));
  }

  const userVehicles = await db
    .select({ id: vehicles.id })
    .from(vehicles)
    .where(eq(vehicles.userId, user.id));

  if (!userVehicles.length) return [];

  const vehicleIds = userVehicles.map((v) => v.id);
  return db
    .select()
    .from(fuelLogs)
    .where(inArray(fuelLogs.vehicleId, vehicleIds))
    .orderBy(desc(fuelLogs.date));
}

export async function addFuelLog(data: {
  vehicleId: string;
  litres: number;
  amount: number;
  odometer: number;
  date: string;
}) {
  const user = await getCurrentUser();
  const vehicle = await db
    .select()
    .from(vehicles)
    .where(and(eq(vehicles.id, data.vehicleId), eq(vehicles.userId, user.id)))
    .limit(1);
  if (!vehicle.length) throw new Error("Vehicle not found");

  const result = await db.insert(fuelLogs).values(data).returning();

  // Update vehicle odometer to latest
  await db
    .update(vehicles)
    .set({ mileage: data.odometer })
    .where(eq(vehicles.id, data.vehicleId));

  revalidatePath("/fuel");
  revalidatePath(`/vehicles/${data.vehicleId}`);
  revalidatePath("/dashboard");
  return result[0];
}

export async function deleteFuelLog(id: string) {
  const existing = await db
    .select()
    .from(fuelLogs)
    .where(eq(fuelLogs.id, id))
    .limit(1);
  if (!existing.length) throw new Error("Fuel log not found");

  const user = await getCurrentUser();
  const vehicle = await db
    .select()
    .from(vehicles)
    .where(
      and(
        eq(vehicles.id, existing[0].vehicleId),
        eq(vehicles.userId, user.id)
      )
    )
    .limit(1);
  if (!vehicle.length) throw new Error("Not authorized");

  await db.delete(fuelLogs).where(eq(fuelLogs.id, id));
  revalidatePath("/fuel");
  revalidatePath(`/vehicles/${existing[0].vehicleId}`);
  revalidatePath("/dashboard");
}

// Get monthly fuel expense data for charts
export async function getMonthlyFuelExpenses() {
  const user = await getCurrentUser();
  const userVehicles = await db
    .select({ id: vehicles.id })
    .from(vehicles)
    .where(eq(vehicles.userId, user.id));

  if (!userVehicles.length) return [];

  const vehicleIds = userVehicles.map((v) => v.id);
  const logs = await db
    .select()
    .from(fuelLogs)
    .where(inArray(fuelLogs.vehicleId, vehicleIds))
    .orderBy(fuelLogs.date);

  // Group by month
  const monthlyData: Record<string, number> = {};
  for (const log of logs) {
    const month = log.date.substring(0, 7); // YYYY-MM
    monthlyData[month] = (monthlyData[month] || 0) + log.amount;
  }

  return Object.entries(monthlyData).map(([month, total]) => ({
    month,
    total,
  }));
}
