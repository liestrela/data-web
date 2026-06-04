import { drizzle } from "drizzle-orm/node-postgres";
import { eq, sql } from "drizzle-orm";
import { users, cards, type User, type Card } from "@/db/schema";
import type { ReviewPeriod } from "@/types.ts";

const db = drizzle(process.env.DATABASE_URL!);

async function createCard(
  userId: number,
  subject: string,
  color: string,
  periods?: ReviewPeriod[],
  schedule?: string,
  notes?: string,
  images?: string[]
): Promise<Card | undefined> {
  const [created] = await db
    .insert(cards)
    .values({
      userId,
      subject,
      color,
      periods,
      schedule,
      notes,
      images
    })
    .returning();

  return created;
}

async function getCard(id: number): Promise<Card | undefined> {
  const [card] = await db
    .select()
    .from(cards)
    .where(eq(cards.id, id));

  return card;
}

async function updateCard(
  id: number,
  updates: Partial<Omit<Card, "id">>,
): Promise<Card | undefined> {
  const [updated] = await db
    .update(cards)
    .set(updates)
    .where(eq(cards.id, id))
    .returning();

  return updated;
}

async function deleteCard(id: number): Promise<Card | undefined> {
  const [deleted] = await db
    .delete(cards)
    .where(eq(cards.id, id))
    .returning();

  return deleted;
}

async function listCards(userId?: number): Promise<Card[]> {
  if (userId !== undefined) {
    return await db.select().from(cards).where(eq(cards.userId, userId));
  }
  return await db.select().from(cards);
}

export { createCard, getCard, updateCard, deleteCard, listCards };