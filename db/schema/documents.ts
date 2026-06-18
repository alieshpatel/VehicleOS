import { pgTable, uuid, varchar, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { vehicles } from "./vehicles";

export const documentTypeEnum = pgEnum("document_type", ["RC", "Insurance", "PUC", "ServiceBill"]);

export const documents = pgTable("documents", {
  id: uuid("id").defaultRandom().primaryKey(),
  vehicleId: uuid("vehicle_id").notNull().references(() => vehicles.id, { onDelete: "cascade" }),
  fileUrl: varchar("file_url", { length: 512 }).notNull(),
  fileName: varchar("file_name", { length: 255 }).notNull(),
  documentType: documentTypeEnum("document_type").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Document = typeof documents.$inferSelect;
export type NewDocument = typeof documents.$inferInsert;
