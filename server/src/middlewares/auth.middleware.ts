import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken";

export { authToken }

export interface AuthRequest extends Request {
  user?: string | jwt.JwtPayload;
}

const secret = process.env.JWT_TOKEN!;

async function authToken(req : AuthRequest, res : Response, next : NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  } else {
    jwt.verify(token, secret, (err, decoded) => {
        if (err) return res.sendStatus(401);

        req.user = decoded;
        next();
    })
  }
}