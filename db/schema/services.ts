import { pgTable, uuid, varchar, integer, timestamp, text, date } from "drizzle-orm/pg-core";
import { vehicles } from "./vehicles";

export const services = pgTable("services", {
  id: uuid("id").defaultRandom().primaryKey(),
  vehicleId: uuid("vehicle_id").notNull().references(() => vehicles.id, { onDelete: "cascade" }),
  serviceDate: date("service_date").notNull(),
  serviceType: varchar("service_type", { length: 100 }).notNull(),
  cost: integer("cost").notNull(),
  serviceCenter: varchar("service_center", { length: 255 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Service = typeof services.$inferSelect;
export type NewService = typeof services.$inferInsert;
