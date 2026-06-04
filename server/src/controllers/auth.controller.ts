import type { Request, Response } from "express";
import { compare } from "bcrypt";
import jwt from "jsonwebtoken";
import { findUserByName, createUser } from "@/models/user.model";

export { login, register };

function genToken(id: number, email: string) {
  return jwt.sign({ sub: id, email: email }, process.env.JWT_SECRET!);
}

async function login(req: Request, res: Response) {
  const { name, password } = req.body;
  const user = await findUserByName(name);

  if (user.length === 0) {
    // Usuário não encontrado = 404
    return res.status(404).json({ error: "Usuário não encontrado" });
  } else if (await compare(password, user[0]!.password)) {
    return res
      .status(200)
      .json({ token: genToken(user[0]!.id, user[0]!.email) });
  } else {
    // Senha errada = 401
    return res.status(401).json({ error: "Não autorizado" });
  }
}

async function register(req: Request, res: Response) {
  const { name, email, password } = req.body;
  const result = await createUser(name, email, password);

  if (typeof result === "number") {
    return res.status(201).json({ token: genToken(result, email) });
  } else {
    // Falhou de criar pq ja tinha algum dos campos únicos
    // a mensagem é o campo único que ja estava no db
    return res.status(409).json({ message: result });
  }
}
