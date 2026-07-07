"use server";

import { db } from "@/db";
import { vehicles, fuelLogs } from "@/db/schema";
import { getCurrentUser } from "@/actions/users";
import { eq, and, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getVehicles(search?: string, fuelType?: string) {
  const user = await getCurrentUser();
  const allVehicles = await db
    .select()
    .from(vehicles)
    .where(eq(vehicles.userId, user.id))
    .orderBy(vehicles.createdAt);

  let filtered = allVehicles;

  if (fuelType && fuelType !== "all") {
    filtered = filtered.filter((v) => v.fuelType === fuelType);
  }

  if (search) {
    const s = search.toLowerCase();
    filtered = filtered.filter(
      (v) =>
        v.brand.toLowerCase().includes(s) ||
        v.model.toLowerCase().includes(s) ||
        v.vehicleNumber.toLowerCase().includes(s)
    );
  }

  // Calculate average mileage for each vehicle
  const vehiclesWithStats = await Promise.all(
    filtered.map(async (v) => {
      const logs = await db
        .select()
        .from(fuelLogs)
        .where(eq(fuelLogs.vehicleId, v.id))
        .orderBy(desc(fuelLogs.date));
      
      let avgMileage = 0;
      if (logs.length >= 2) {
        const totalDistance = logs[0].odometer - logs[logs.length - 1].odometer;
        // The fuel consumed for this distance is the sum of all logs EXCEPT the last one
        // (since the last fill-up is what covers the subsequent distance, not the previous)
        // Wait, standard full-tank method: sum of litres of all logs except the FIRST log (chronologically, which is the last in desc order)
        const totalFuel = logs.slice(0, logs.length - 1).reduce((sum, log) => sum + log.litres, 0);
        
        if (totalFuel > 0 && totalDistance > 0) {
          avgMileage = parseFloat((totalDistance / totalFuel).toFixed(1));
        }
      }

      return { ...v, avgMileage };
    })
  );

  return vehiclesWithStats;
}

export async function getVehicle(id: string) {
  const user = await getCurrentUser();
  const result = await db
    .select()
    .from(vehicles)
    .where(and(eq(vehicles.id, id), eq(vehicles.userId, user.id)))
    .limit(1);
  return result[0] || null;
}

export async function addVehicle(data: {
  vehicleNumber: string;
  brand: string;
  model: string;
  year: number;
  fuelType: "petrol" | "diesel" | "cng" | "electric" | "hybrid";
  mileage: number;
}) {
  const user = await getCurrentUser();
  const result = await db
    .insert(vehicles)
    .values({ ...data, userId: user.id })
    .returning();
  revalidatePath("/vehicles");
  revalidatePath("/dashboard");
  return result[0];
}

export async function updateVehicle(
  id: string,
  data: {
    vehicleNumber?: string;
    brand?: string;
    model?: string;
    year?: number;
    fuelType?: "petrol" | "diesel" | "cng" | "electric" | "hybrid";
    mileage?: number;
  }
) {
  const user = await getCurrentUser();
  await db
    .update(vehicles)
    .set(data)
    .where(and(eq(vehicles.id, id), eq(vehicles.userId, user.id)));
  revalidatePath("/vehicles");
  revalidatePath(`/vehicles/${id}`);
  revalidatePath("/dashboard");
}

export async function deleteVehicle(id: string) {
  const user = await getCurrentUser();
  await db
    .delete(vehicles)
    .where(and(eq(vehicles.id, id), eq(vehicles.userId, user.id)));
  revalidatePath("/vehicles");
  revalidatePath("/dashboard");
}
