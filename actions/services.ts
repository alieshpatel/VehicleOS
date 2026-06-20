"use server";

import { db } from "@/db";
import { services, vehicles } from "@/db/schema";
import { getCurrentUser } from "@/actions/users";
import { eq, and, desc, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Get all services for the current user (across all their vehicles)
export async function getServices(vehicleId?: string) {
  const user = await getCurrentUser();

  if (vehicleId) {
    // Verify ownership
    const vehicle = await db
      .select()
      .from(vehicles)
      .where(and(eq(vehicles.id, vehicleId), eq(vehicles.userId, user.id)))
      .limit(1);
    if (!vehicle.length) return [];

    return db
      .select()
      .from(services)
      .where(eq(services.vehicleId, vehicleId))
      .orderBy(desc(services.serviceDate));
  }

  // All services across user's vehicles
  const userVehicles = await db
    .select({ id: vehicles.id })
    .from(vehicles)
    .where(eq(vehicles.userId, user.id));

  if (!userVehicles.length) return [];

  const vehicleIds = userVehicles.map((v) => v.id);
  return db
    .select()
    .from(services)
    .where(inArray(services.vehicleId, vehicleIds))
    .orderBy(desc(services.serviceDate));
}

export async function addService(data: {
  vehicleId: string;
  serviceDate: string;
  serviceType: string;
  cost: number;
  serviceCenter?: string;
  notes?: string;
}) {
  const user = await getCurrentUser();
  // Verify vehicle ownership
  const vehicle = await db
    .select()
    .from(vehicles)
    .where(and(eq(vehicles.id, data.vehicleId), eq(vehicles.userId, user.id)))
    .limit(1);
  if (!vehicle.length) throw new Error("Vehicle not found");

  const result = await db.insert(services).values(data).returning();
  revalidatePath("/services");
  revalidatePath(`/vehicles/${data.vehicleId}`);
  revalidatePath("/dashboard");
  return result[0];
}

export async function updateService(
  id: string,
  data: {
    serviceDate?: string;
    serviceType?: string;
    cost?: number;
    serviceCenter?: string;
    notes?: string;
  }
) {
  // Get the service to find its vehicleId for ownership check
  const existing = await db
    .select()
    .from(services)
    .where(eq(services.id, id))
    .limit(1);
  if (!existing.length) throw new Error("Service not found");

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

  await db.update(services).set(data).where(eq(services.id, id));
  revalidatePath("/services");
  revalidatePath(`/vehicles/${existing[0].vehicleId}`);
  revalidatePath("/dashboard");
}

export async function deleteService(id: string) {
  const existing = await db
    .select()
    .from(services)
    .where(eq(services.id, id))
    .limit(1);
  if (!existing.length) throw new Error("Service not found");

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

  await db.delete(services).where(eq(services.id, id));
  revalidatePath("/services");
  revalidatePath(`/vehicles/${existing[0].vehicleId}`);
  revalidatePath("/dashboard");
}
