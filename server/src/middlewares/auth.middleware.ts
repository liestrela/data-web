import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export { authToken };

export interface TokenPayload {
  sub: number;
  email: string;
  iat: number;
  exp: number;
}

export interface AuthRequest extends Request {
  user?: TokenPayload;
}

const secret = process.env.JWT_SECRET!;

async function authToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.sendStatus(401).json({ error: "Token não fornecido" });
  } else {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) return res.sendStatus(401);

      if (!decoded || typeof decoded === "string") {
        return res.sendStatus(401).json({ error: "Token inválido" });
      }

      // garante que está no formato de resposta de /login
      if (!("sub" in decoded) || !("email" in decoded)) {
        return res.sendStatus(401).json({ error: "Token inválido" }); 
      }

      req.user = {
        sub: Number(decoded.sub),
        email: decoded.email as string,
        iat: decoded.iat ?? 0,
        exp: decoded.exp ?? 0,
      };
      next();
    });
  }
}
