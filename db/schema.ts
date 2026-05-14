// from drizzle setup
import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

// tables definition & export of typeof
export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar().notNull(),
  email: varchar().notNull(),
  password: varchar().notNull()
});
export type User = typeof usersTable.$inferInsert

export const blogTable = pgTable("blog", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar().notNull(),
  email: varchar().notNull(),
  description: varchar().notNull(),
  image: varchar()
});
export type Blog = typeof blogTable.$inferInsert
