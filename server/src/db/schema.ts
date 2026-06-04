import { integer, pgTable, text, jsonb, varchar } from "drizzle-orm/pg-core";
import { type InferSelectModel } from "drizzle-orm";
import { Schedule } from "@/util/rschedule";
import type { ReviewPeriod, Review } from "@/types";

const users = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar().notNull().unique(),
  email: varchar().notNull().unique(),
  password: varchar().notNull(),
});

const cards = pgTable("cards", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  subject: varchar().notNull(),
  color: varchar().notNull(),
  periods: jsonb().$type<ReviewPeriod[]>(),
  schedule: jsonb(),
  notes: text(),
  images: text().array().default([]),
});

export { users, cards };
export type User = InferSelectModel<typeof users>;
export type Card = InferSelectModel<typeof cards>;