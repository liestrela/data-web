import { drizzle } from "drizzle-orm/node-postgres"
import { eq } from "drizzle-orm";
import { users, type User } from "@/db/schema";
import { genSalt, hash } from "bcrypt";
import { DatabaseError } from "pg";

export { createUser, findUserById, findUserByName}

const db = drizzle(process.env.DATABASE_URL!)

async function createUser(name: string, email: string, password: string) : Promise<string> {
  const salt = await genSalt();
  const hashpass = await hash(password, salt);

  try {
    await db.insert(users).values({
      name: name,
      email: email,
      password: hashpass
    });

  } catch (error) {
    if (error instanceof DatabaseError) {
      if (error.detail!.includes("email")) {
        return "email";
      }
      if (error.detail!.includes("name")) {
        return "name";
      }
    }
  }
  return "ok";
}

async function findUserById(id : number) : Promise<User[]> {
  return await db.select()
    .from(users)
    .where(eq(users.id, id)); 
}

async function findUserByName(name: string) : Promise<User[]> {
  return await db.select()
    .from(users)
    .where(eq(users.name, name));
}