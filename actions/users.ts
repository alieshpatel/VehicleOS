"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

// Get the current user's DB record, creating one as a fallback if the webhook hasn't fired yet
export async function getCurrentUser() {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  // Try to find existing user
  const existingUsers = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, userId))
    .limit(1);

  if (existingUsers.length > 0) {
    return existingUsers[0];
  }

  // Fallback: create user inline if webhook hasn't fired yet
  const { sessionClaims } = await auth();
  const name =
    (sessionClaims?.firstName as string) ||
    (sessionClaims?.fullName as string) ||
    "User";
  const email = (sessionClaims?.email as string) || "";

  const newUsers = await db
    .insert(users)
    .values({
      clerkId: userId,
      name,
      email,
      role: "owner",
    })
    .onConflictDoUpdate({
      target: users.clerkId,
      set: { name, email },
    })
    .returning();

  return newUsers[0];
}

// Get user by clerk ID (read-only, no creation)
export async function getUserByClerkId(clerkId: string) {
  const result = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, clerkId))
    .limit(1);

  return result[0] || null;
}

// Update user profile
export async function updateUserProfile(name: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");

  await db.update(users).set({ name }).where(eq(users.clerkId, userId));
}

// Get total user count (for admin page)
export async function getUserCount() {
  const result = await db.select().from(users);
  return result.length;
}
