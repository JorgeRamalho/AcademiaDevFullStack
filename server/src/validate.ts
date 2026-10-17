import { HttpError } from "./http.js";
import { levels, pillars, type Level, type Pillar } from "./types.js";

export type RegistrationInput = {
  name: string;
  email: string;
  password: string;
  level: Level;
  pillar: Pillar;
  goal: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isLevel(value: unknown): value is Level {
  return typeof value === "string" && levels.some((level) => level === value);
}

function isPillar(value: unknown): value is Pillar {
  return typeof value === "string" && pillars.some((pillar) => pillar === value);
}

export function readRegistration(body: unknown): RegistrationInput {
  if (!isRecord(body)) {
    throw new HttpError(400, "Envie os dados do cadastro.");
  }

  const fields: Record<string, string> = {};
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const goal = typeof body.goal === "string" ? body.goal.trim() : body.goal === undefined ? "" : null;

  if (name.length < 2 || name.length > 80) {
    fields.name = "Informe seu nome.";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    fields.email = "Informe um e-mail válido.";
  }
  if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    fields.password = "Use 8 caracteres, com letra e número.";
  }
  if (!isLevel(body.level)) {
    fields.level = "Escolha seu nível.";
  }
  if (!isPillar(body.pillar)) {
    fields.pillar = "Escolha um pilar.";
  }
  if (goal === null || goal.length > 280) {
    fields.goal = "Encurte o objetivo para 280 caracteres.";
  }
  if (body.aceite !== true) {
    fields.aceite = "Confirme que vai praticar.";
  }

  if (Object.keys(fields).length > 0 || !isLevel(body.level) || !isPillar(body.pillar) || goal === null) {
    throw new HttpError(400, "Revise os campos destacados.", fields);
  }

  return {
    name,
    email,
    password,
    level: body.level,
    pillar: body.pillar,
    goal,
  };
}

export function readLogin(body: unknown): { email: string; password: string } {
  if (!isRecord(body) || typeof body.email !== "string" || typeof body.password !== "string") {
    throw new HttpError(400, "Informe e-mail e senha.");
  }
  return { email: body.email.trim().toLowerCase(), password: body.password };
}

export function readSession(body: unknown): { minutes: number; note: string } {
  if (!isRecord(body)) {
    throw new HttpError(400, "Envie a sessão de estudo.");
  }
  const minutes = body.minutes;
  const note = typeof body.note === "string" ? body.note.trim() : "";
  const fields: Record<string, string> = {};
  if (typeof minutes !== "number" || !Number.isInteger(minutes) || minutes < 1 || minutes > 180) {
    fields.minutes = "Informe de 1 a 180 minutos.";
  }
  if (note.length < 3 || note.length > 180) {
    fields.note = "Escreva uma nota curta sobre o foco.";
  }
  if (Object.keys(fields).length > 0 || typeof minutes !== "number") {
    throw new HttpError(400, "Revise os campos destacados.", fields);
  }
  return { minutes, note };
}
