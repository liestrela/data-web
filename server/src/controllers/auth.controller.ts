import type { Request, Response } from "express"
import { compare } from "bcrypt";
import { findUserByName, createUser } from "@/models/user.model"

export { login, register }

async function login(req : Request, res : Response) {
  const { name, password } = req.body;
  const user = await findUserByName(name);
  if (user.length === 0) {
      res.json({ message: "User not found"})
  } else if (await compare(password, user[0]!.password)) {
      res.json({ message: "Ok"});
  } else {
      res.json({ message: "Wrong pssword"});
  }
}

async function register(req : Request, res : Response) {
  const { name, email, password } = req.body;
  const result = await createUser(name, email, password);
  res.json({ message: result });
}