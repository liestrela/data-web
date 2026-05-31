import { drizzle } from "drizzle-orm/node-postgres";
import { eq, sql } from "drizzle-orm";
import { user, card, type User, type Card} from "@/db/schema";
import { ReviewPeriod } from "@/types.ts";

const db = drizzle(process.env.DATABASE_URL!);

async function createCard(
  subject: string,
  periods?: ReviewPeriod[],
  schedule?: string,
  notes?: string,
  color?: string,
): Promise<Card> {
  const [created] = await.db.insert(card).values({
    subject,
    periods,
    schedule,
    notes,
    color,
  }).returning();

  return created;
}

/* continuar
async function getCard( */
