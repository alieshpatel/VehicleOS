import { pgTable, uuid, varchar, timestamp, pgEnum } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["owner", "garage", "admin"]);

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  clerkId: varchar("clerk_id", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  role: roleEnum("role").notNull().default("owner"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
