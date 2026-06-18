import { pgTable, uuid, varchar, integer, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { users } from "./users";

export const fuelTypeEnum = pgEnum("fuel_type", ["petrol", "diesel", "cng", "electric", "hybrid"]);

export const vehicles = pgTable("vehicles", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  vehicleNumber: varchar("vehicle_number", { length: 20 }).notNull(),
  brand: varchar("brand", { length: 100 }).notNull(),
  model: varchar("model", { length: 100 }).notNull(),
  year: integer("year").notNull(),
  fuelType: fuelTypeEnum("fuel_type").notNull(),
  mileage: integer("mileage").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Vehicle = typeof vehicles.$inferSelect;
export type NewVehicle = typeof vehicles.$inferInsert;
