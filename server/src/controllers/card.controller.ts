import { createCard, getCard, updateCard, deleteCard, listCards } from "@/models/card.model";
import { findUserById } from "@/models/user.model";
import type { Request, Response } from "express";
import type { AuthRequest } from "@/middlewares/auth.middleware";

async function create(req: AuthRequest, res: Response) {
  const user = req.user;
  if (!user) return res.status(401).json({ error: "Usuário não autenticado" });
  const data = req.body;
  if (!data) return res.status(400).json({ error: "Dados não fornecidos" });

  if (
    typeof data.subject !== "string" ||
    typeof data.color !== "string" ||
    !Array.isArray(data.periods) ||
    typeof data.schedule !== "object" || data.schedule === null
  ) {
    return res.status(400).json({ error: "Dados inválidos" });
  }

  if (data.notes !== undefined && typeof data.notes !== "string") {
    return res.status(400).json({ error: "Dados inválidos" });
  }

  if (
    data.attachments !== undefined &&
    (!Array.isArray(data.attachments) || !data.attachments.every((f: any) => typeof f === "string"))
  ) {
    return res.status(400).json({ error: "Dados inválidos" });
  }

  const created = await createCard(
    user.sub,
    data.subject,
    data.color,
    data.periods,
    data.schedule,
    data.notes,
    data.attachments
  );

  return res.status(201).json(created);
}

async function get(req: AuthRequest, res: Response) {
  const user = req.user;
  if (!user) return res.status(401).json({ error: "Usuário não autenticado" });

  const foundUser = await findUserById(user.sub);
  if (foundUser.length === 0) {
    return res.status(404).json({ error: "Usuário não encontrado" });
  }

  const userCards = await listCards(user.sub);

  return res.status(200).json(userCards);
}

async function update(req: AuthRequest, res: Response) {
  const user = req.user;
  if (!user) return res.status(401).json({ error: "Usuário não autenticado" });

  const data = req.body;
  if (!data || typeof data.id !== "number") return res.status(400).json({ error: "Dados inválidos" });

  const card = await getCard(data.id);
  if (!card) return res.status(404).json({ error: "Card não encontrado" });
  if (card.userId !== user.sub) return res.status(403).json({ error: "Acesso negado" });

  const updates: Record<string, any> = {};
  if (typeof data.subject === "string") updates.subject = data.subject;
  if (typeof data.color === "string") updates.color = data.color;
  if (Array.isArray(data.periods)) updates.periods = data.periods;
  if (typeof data.schedule === "object" && data.schedule !== null) updates.schedule = data.schedule;
  if (typeof data.notes === "string") updates.notes = data.notes;

  if (
    Array.isArray(data.attachments) &&
    data.attachments.every((f: any) => typeof f === "string")
  ) {
    updates.attachments = data.attachments;
  } else if (data.attachments !== undefined) {
    return res.status(400).json({ error: "Anexos inválidos" });
  }

  const updated = await updateCard(data.id, updates);
  return res.status(200).json(updated);
}

async function remove(req: AuthRequest, res: Response) {
  const user = req.user;
  if (!user) return res.status(401).json({ error: "Usuário não autenticado" });

  const data = req.body;
  if (!data || typeof data.id !== "number") return res.status(400).json({ error: "Dados inválidos" });

  const card = await getCard(data.id);
  if (!card) return res.status(404).json({ error: "Card não encontrado" });
  if (card.userId !== user.sub) return res.status(403).json({ error: "Acesso negado" });

  const deleted = await deleteCard(data.id);
  return res.status(200).json(deleted);
}

export { create, get, update, remove };