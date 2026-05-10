import type { Request, Response } from "express"
import { compare } from "bcrypt";
import jwt from "jsonwebtoken";
import { findUserByName, createUser } from "@/models/user.model"

export { login, register }

const secret = process.env.JWT_SECRET!;

function genToken(id : number, email : string) {
  return jwt.sign(
    { sub: id, email: email },
    secret
  )
}

async function login(req : Request, res : Response) {
  const { name, password } = req.body;
  const user = await findUserByName(name);

  if (user.length === 0) {
    // Usuário não encontrado = 404
    return res.sendStatus(404);
  } else if (await compare(password, user[0]!.password)) {
    return res.status(200)
      .json({ token: genToken(user[0]!.id, user[0]!.email)});
  } else {
    // Senha errada = 401
    return res.sendStatus(401);
  }
}

async function register(req : Request, res : Response) {
  const { name, email, password } = req.body;
  const result = await createUser(name, email, password);

  if (result === "ok") {
    return res.status(201)
      .json({ token: genToken(name, email) })
  } else {
    // Falhou de criar pq ja tinha algum dos campos únicos
    // a mensagem é o campo único que ja estava no db
    return res.status(409)
      .json({ message: result })
  }
}