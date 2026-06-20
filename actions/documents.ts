"use server";

import { db } from "@/db";
import { documents, vehicles } from "@/db/schema";
import { getCurrentUser } from "@/actions/users";
import { eq, and, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getDocuments(vehicleId?: string) {
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
      .from(documents)
      .where(eq(documents.vehicleId, vehicleId));
  }

  const userVehicles = await db
    .select({ id: vehicles.id })
    .from(vehicles)
    .where(eq(vehicles.userId, user.id));

  if (!userVehicles.length) return [];

  const vehicleIds = userVehicles.map((v) => v.id);
  return db
    .select()
    .from(documents)
    .where(inArray(documents.vehicleId, vehicleIds));
}

export async function addDocument(data: {
  vehicleId: string;
  fileUrl: string;
  fileName: string;
  documentType: "RC" | "Insurance" | "PUC" | "ServiceBill";
}) {
  const user = await getCurrentUser();
  const vehicle = await db
    .select()
    .from(vehicles)
    .where(and(eq(vehicles.id, data.vehicleId), eq(vehicles.userId, user.id)))
    .limit(1);
  if (!vehicle.length) throw new Error("Vehicle not found");

  const result = await db.insert(documents).values(data).returning();
  revalidatePath("/documents");
  revalidatePath(`/vehicles/${data.vehicleId}`);
  return result[0];
}

export async function deleteDocument(id: string) {
  const existing = await db
    .select()
    .from(documents)
    .where(eq(documents.id, id))
    .limit(1);
  if (!existing.length) throw new Error("Document not found");

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

  await db.delete(documents).where(eq(documents.id, id));
  revalidatePath("/documents");
  revalidatePath(`/vehicles/${existing[0].vehicleId}`);
}
