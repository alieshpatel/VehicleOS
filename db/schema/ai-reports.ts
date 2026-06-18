import { pgTable, uuid, text, timestamp, jsonb } from "drizzle-orm/pg-core";
import { vehicles } from "./vehicles";

export const aiReports = pgTable("ai_reports", {
  id: uuid("id").defaultRandom().primaryKey(),
  vehicleId: uuid("vehicle_id").notNull().references(() => vehicles.id, { onDelete: "cascade" }),
  symptoms: text("symptoms").notNull(),
  diagnosis: jsonb("diagnosis").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type AiReport = typeof aiReports.$inferSelect;
export type NewAiReport = typeof aiReports.$inferInsert;
