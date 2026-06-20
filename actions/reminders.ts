"use server";

import { db } from "@/db";
import { reminders, vehicles } from "@/db/schema";
import { getCurrentUser } from "@/actions/users";
import { eq, and, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export type ReminderStatus = "done" | "overdue" | "upcoming" | "scheduled";

export type ReminderWithStatus = {
  id: string;
  vehicleId: string;
  title: string;
  dueDate: string;
  completed: boolean;
  createdAt: Date;
  status: ReminderStatus;
};

function computeStatus(dueDate: string, completed: boolean): ReminderStatus {
  if (completed) return "done";
  const due = new Date(dueDate);
  const now = new Date();
  const daysUntil = (due.getTime() - now.getTime()) / 86_400_000;
  if (daysUntil < 0) return "overdue";
  if (daysUntil <= 7) return "upcoming";
  return "scheduled";
}

export async function getReminders(): Promise<ReminderWithStatus[]> {
  const user = await getCurrentUser();
  const userVehicles = await db
    .select({ id: vehicles.id })
    .from(vehicles)
    .where(eq(vehicles.userId, user.id));

  if (!userVehicles.length) return [];

  const vehicleIds = userVehicles.map((v) => v.id);
  const rows = await db
    .select()
    .from(reminders)
    .where(inArray(reminders.vehicleId, vehicleIds));

  return rows.map((r) => ({
    ...r,
    status: computeStatus(r.dueDate, r.completed),
  }));
}

export async function getUpcomingReminders(): Promise<ReminderWithStatus[]> {
  const all = await getReminders();
  return all.filter((r) => r.status === "upcoming" || r.status === "overdue");
}

export async function addReminder(data: {
  vehicleId: string;
  title: string;
  dueDate: string;
}) {
  const user = await getCurrentUser();
  const vehicle = await db
    .select()
    .from(vehicles)
    .where(and(eq(vehicles.id, data.vehicleId), eq(vehicles.userId, user.id)))
    .limit(1);
  if (!vehicle.length) throw new Error("Vehicle not found");

  const result = await db.insert(reminders).values(data).returning();
  revalidatePath("/reminders");
  revalidatePath("/dashboard");
  return result[0];
}

export async function updateReminder(
  id: string,
  data: { title?: string; dueDate?: string; completed?: boolean }
) {
  const existing = await db
    .select()
    .from(reminders)
    .where(eq(reminders.id, id))
    .limit(1);
  if (!existing.length) throw new Error("Reminder not found");

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

  await db.update(reminders).set(data).where(eq(reminders.id, id));
  revalidatePath("/reminders");
  revalidatePath("/dashboard");
}

export async function deleteReminder(id: string) {
  const existing = await db
    .select()
    .from(reminders)
    .where(eq(reminders.id, id))
    .limit(1);
  if (!existing.length) throw new Error("Reminder not found");

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

  await db.delete(reminders).where(eq(reminders.id, id));
  revalidatePath("/reminders");
  revalidatePath("/dashboard");
}
