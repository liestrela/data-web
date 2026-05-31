import { integer, pgTable, text, jsonb, varchar } from "drizzle-orm/pg-core";
import { type InferSelectModel } from 'drizzle-orm';
import { Schedule } from "@/util/rschedule";
import { ReviewPeriod, Review } from "@/types";

export const users = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar().notNull().unique(),
  email: varchar().notNull().unique(),
  password: varchar().notNull()
});

export const card = pgTable("cards", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  subject: varchar().notNull(),
  periods: jsonb().$type<ReviewPeriod[]>(),
  schedule: jsonb(),
  notes: text(),
  color: varchar().notNull(),
});

export type User = InferSelectModel<typeof users>;
export type Card = InferSelectModel<typeof card>;
