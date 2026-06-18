import { pgTable, uuid, integer, timestamp, date, real } from "drizzle-orm/pg-core";
import { vehicles } from "./vehicles";

export const fuelLogs = pgTable("fuel_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  vehicleId: uuid("vehicle_id").notNull().references(() => vehicles.id, { onDelete: "cascade" }),
  litres: real("litres").notNull(),
  amount: integer("amount").notNull(),
  odometer: integer("odometer").notNull(),
  date: date("date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type FuelLog = typeof fuelLogs.$inferSelect;
export type NewFuelLog = typeof fuelLogs.$inferInsert;
