import { integer, pgTable, varchar } from "drizzle-orm/pg-core";
import { type InferSelectModel } from 'drizzle-orm';

export const users = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar().notNull().unique(),
  email: varchar().notNull().unique(),
  password: varchar().notNull()
});

export type User = InferSelectModel<typeof users>;