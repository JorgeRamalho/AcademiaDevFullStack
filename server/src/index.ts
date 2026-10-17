import cors from "cors";
import express, { type NextFunction, type Request, type Response } from "express";
import { hashPassword, signToken, verifyPassword, verifyToken } from "./auth.js";
import {
  addSession,
  createStudent,
  findStudentByEmail,
  findStudentById,
  getExercise,
  getExerciseSecret,
  getOverview,
  getProgress,
  getSchema,
  getStudyPlan,
  getTrack,
  listExercises,
  listSessions,
  listTools,
  listTracks,
  recordAttempt,
} from "./db.js";
import { gradeAnswer } from "./grade.js";
import { HttpError, routeParam } from "./http.js";
import type { ExerciseType, Student } from "./types.js";
import { readLogin, readRegistration, readSession } from "./validate.js";

const app = express();
app.disable("x-powered-by");
app.use(cors());
app.use(express.json({ limit: "32kb" }));

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "academia-devfullstack-api" });
});

app.get("/api/overview", (_req, res) => {
  res.json(getOverview());
});

app.get("/api/tracks", (_req, res) => {
  res.json(listTracks());
});

app.get("/api/tracks/:slug", (req, res) => {
  const track = getTrack(routeParam(req.params.slug));
  if (!track) {
    throw new HttpError(404, "Trilha não encontrada.");
  }
  res.json(track);
});

app.get("/api/exercises", (req, res) => {
  const student = optionalStudent(req);
  res.json(listExercises(student?.id ?? null));
});

app.get("/api/exercises/:slug", (req, res) => {
  const student = optionalStudent(req);
  const exercise = getExercise(routeParam(req.params.slug), student?.id ?? null);
  if (!exercise) {
    throw new HttpError(404, "Exercício não encontrado.");
  }
  res.json(exercise);
});

app.post("/api/exercises/:slug/attempts", (req, res) => {
  const secret = getExerciseSecret(routeParam(req.params.slug));
  if (!secret) {
    throw new HttpError(404, "Exercício não encontrado.");
  }
  const submission = readSubmission(secret.type, req.body);
  const correct = gradeAnswer(secret.type, secret.answer, submission);
  const student = optionalStudent(req);
  if (student) {
    recordAttempt(student.id, secret.id, correct);
  }
  res.json({
    correct,
    explanation: secret.explanation,
    hint: correct ? null : secret.hint,
    saved: Boolean(student),
  });
});

app.get("/api/tools", (_req, res) => {
  res.json(listTools());
});

app.get("/api/schema", (_req, res) => {
  res.json({
    engine: "SQLite",
    note: "Modelo relacional no mesmo espírito de PostgreSQL e MySQL. A coluna password_hash guarda o scrypt, nunca a senha digitada.",
    tables: getSchema(),
  });
});

app.post("/api/auth/register", (req, res) => {
  const input = readRegistration(req.body);
  if (findStudentByEmail(input.email)) {
    throw new HttpError(409, "Este e-mail já está inscrito.", { email: "Este e-mail já está inscrito." });
  }
  const student = createStudent({
    name: input.name,
    email: input.email,
    passwordHash: hashPassword(input.password),
    level: input.level,
    pillar: input.pillar,
    goal: input.goal,
  });
  res.status(201).json({ token: signToken(student), student });
});

app.post("/api/auth/login", (req, res) => {
  const input = readLogin(req.body);
  const found = findStudentByEmail(input.email);
  if (!found || !verifyPassword(input.password, found.passwordHash)) {
    throw new HttpError(401, "E-mail ou senha não conferem.");
  }
  const student: Student = {
    id: found.id,
    name: found.name,
    email: found.email,
    level: found.level,
    pillar: found.pillar,
    goal: found.goal,
    createdAt: found.createdAt,
  };
  res.json({ token: signToken(student), student });
});

app.get("/api/auth/me", (req, res) => {
  res.json({ student: requireStudent(req) });
});

app.get("/api/progress", (req, res) => {
  const student = requireStudent(req);
  res.json(getProgress(student.id));
});

app.get("/api/study/plan", (req, res) => {
  const student = optionalStudent(req);
  const plan = getStudyPlan(student?.pillar ?? null);
  if (!plan) {
    throw new HttpError(404, "Plano de estudos indisponível.");
  }
  res.json(plan);
});

app.get("/api/study/sessions", (req, res) => {
  const student = requireStudent(req);
  res.json(listSessions(student.id));
});

app.post("/api/study/sessions", (req, res) => {
  const student = requireStudent(req);
  const input = readSession(req.body);
  res.status(201).json(addSession(student.id, student.pillar, input.minutes, input.note));
});

app.use("/api", (_req, res) => {
  res.status(404).json({ error: "Rota não encontrada." });
});

app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof HttpError) {
    res.status(error.status).json({ error: error.message, fields: error.fields });
    return;
  }
  console.error(error);
  res.status(500).json({ error: "Algo saiu do eixo por aqui. Tente de novo.", fields: {} });
});

function optionalStudent(req: Request): Student | null {
  const header = req.header("authorization");
  if (!header) {
    return null;
  }
  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) {
    throw new HttpError(401, "Sua sessão expirou. Entre de novo.");
  }
  const payload = verifyToken(token);
  if (!payload) {
    throw new HttpError(401, "Sua sessão expirou. Entre de novo.");
  }
  const student = findStudentById(payload.sub);
  if (!student) {
    throw new HttpError(401, "Sua sessão expirou. Entre de novo.");
  }
  return student;
}

function requireStudent(req: Request): Student {
  const student = optionalStudent(req);
  if (!student) {
    throw new HttpError(401, "Entre na sua conta para continuar.");
  }
  return student;
}

function readSubmission(type: ExerciseType, body: unknown): unknown {
  if (typeof body !== "object" || body === null || !("answer" in body)) {
    throw new HttpError(400, "Envie uma resposta.");
  }
  const answer = body.answer;
  switch (type) {
    case "choice":
    case "fill":
      if (typeof answer !== "string" || answer.trim() === "") {
        throw new HttpError(400, type === "choice" ? "Escolha uma alternativa." : "Preencha a resposta.");
      }
      return type === "fill" ? answer.trim() : answer;
    case "order":
      if (!Array.isArray(answer) || answer.some((item) => typeof item !== "string")) {
        throw new HttpError(400, "Organize os itens antes de verificar.");
      }
      return answer;
    default: {
      const unknown: never = type;
      throw new HttpError(400, `Tipo inválido: ${String(unknown)}`);
    }
  }
}

const port = Number(process.env.PORT ?? 4000);
app.listen(port, "0.0.0.0", () => {
  console.log(`Academia DEVFullStack API em http://127.0.0.1:${port}`);
});
