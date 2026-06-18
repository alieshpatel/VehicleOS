import { pgTable, uuid, varchar, timestamp, boolean, date } from "drizzle-orm/pg-core";
import { vehicles } from "./vehicles";

export const reminders = pgTable("reminders", {
  id: uuid("id").defaultRandom().primaryKey(),
  vehicleId: uuid("vehicle_id").notNull().references(() => vehicles.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  dueDate: date("due_date").notNull(),
  completed: boolean("completed").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Reminder = typeof reminders.$inferSelect;
export type NewReminder = typeof reminders.$inferInsert;
