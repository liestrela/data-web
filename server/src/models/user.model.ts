import { drizzle } from "drizzle-orm/node-postgres"
import { eq, sql } from "drizzle-orm";
import { users, type User } from "@/db/schema";
import { genSalt, hash } from "bcrypt";

export { createUser, findUserById, findUserByName}

const db = drizzle(process.env.DATABASE_URL!)

async function createUser(name: string, email: string, password: string) : Promise<string> {
  const salt = await genSalt();
  const hashpass = await hash(password, salt);

  // Verificar se o email ou usuário existem no banco
  const [res_name] = await db
    .select({ exists: sql<boolean>`1` })
    .from(users)
    .where(eq(users.name, name))
    .limit(1)
  
  if (!!res_name) return "user";

  const [res_email] = await db
    .select({ exists: sql<boolean>`1` })
    .from(users)
    .where(eq(users.email, email))
    .limit(1)

  if (!!res_email) return "email";

  await db.insert(users).values({
    name: name,
    email: email,
    password: hashpass
  });

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