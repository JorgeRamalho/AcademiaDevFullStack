import fs from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { exercises, quotes, tools } from "./catalog.js";
import { tracks } from "./tracks.js";
import type { ExerciseType, Level, Pillar, Student } from "./types.js";

const CONTENT_VERSION = "2";

const tableNames = [
  "students",
  "tracks",
  "modules",
  "lessons",
  "exercises",
  "attempts",
  "study_sessions",
  "tools",
] as const;

type TableName = (typeof tableNames)[number];

const dbPath = path.resolve(
  process.env.ACADEMIA_DEVFULLSTACK_DB ??
    process.env.FORJA_DB ??
    path.join(process.cwd(), "server", "data", "academia-devfullstack.db"),
);
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

const db = new DatabaseSync(dbPath);
db.exec("PRAGMA foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS meta (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    level TEXT NOT NULL CHECK (level IN ('iniciante', 'intermediario', 'avancado')),
    pillar TEXT NOT NULL CHECK (pillar IN ('mern', 'mean', 'lamp', 'dotnet')),
    goal TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS tracks (
    slug TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    stack TEXT NOT NULL,
    summary TEXT NOT NULL,
    promise TEXT NOT NULL,
    aside TEXT NOT NULL,
    color TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS modules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    track_slug TEXT NOT NULL REFERENCES tracks(slug),
    level TEXT NOT NULL,
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    position INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS lessons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    module_id INTEGER NOT NULL REFERENCES modules(id),
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    position INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS exercises (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    track_slug TEXT NOT NULL REFERENCES tracks(slug),
    level TEXT NOT NULL,
    title TEXT NOT NULL,
    prompt TEXT NOT NULL,
    illustration TEXT NOT NULL,
    type TEXT NOT NULL,
    payload TEXT NOT NULL,
    answer TEXT NOT NULL,
    hint TEXT NOT NULL,
    explanation TEXT NOT NULL,
    position INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS attempts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL REFERENCES students(id),
    exercise_id INTEGER NOT NULL REFERENCES exercises(id),
    correct INTEGER NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS study_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL REFERENCES students(id),
    track_slug TEXT NOT NULL,
    minutes INTEGER NOT NULL,
    note TEXT NOT NULL,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS tools (
    slug TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    layer TEXT NOT NULL,
    summary TEXT NOT NULL,
    track_slug TEXT REFERENCES tracks(slug)
  );
`);

type StudentRow = {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  level: string;
  pillar: string;
  goal: string;
  created_at: string;
};

function asLevel(value: string): Level {
  switch (value) {
    case "iniciante":
    case "intermediario":
    case "avancado":
      return value;
    default:
      throw new Error(`Nível inválido no banco: ${value}`);
  }
}

function asPillar(value: string): Pillar {
  switch (value) {
    case "mern":
    case "mean":
    case "lamp":
    case "dotnet":
      return value;
    default:
      throw new Error(`Pilar inválido no banco: ${value}`);
  }
}

export function asExerciseType(value: string): ExerciseType {
  switch (value) {
    case "choice":
    case "fill":
    case "order":
      return value;
    default:
      throw new Error(`Tipo de exercício inválido no banco: ${value}`);
  }
}

function mapStudent(row: StudentRow): Student {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    level: asLevel(row.level),
    pillar: asPillar(row.pillar),
    goal: row.goal,
    createdAt: row.created_at,
  };
}

function countOf(table: TableName): number {
  switch (table) {
    case "students":
    case "tracks":
    case "modules":
    case "lessons":
    case "exercises":
    case "attempts":
    case "study_sessions":
    case "tools": {
      const row = db.prepare(`SELECT COUNT(*) AS n FROM ${table}`).get() as { n: number };
      return Number(row.n);
    }
    default: {
      const unknown: never = table;
      throw new Error(unknown);
    }
  }
}

function seed(): void {
  const current = db.prepare("SELECT value FROM meta WHERE key = 'content_version'").get() as { value: string } | undefined;
  if (current?.value === CONTENT_VERSION) {
    return;
  }

  const insertTrack = db.prepare(
    "INSERT INTO tracks (slug, name, stack, summary, promise, aside, color) VALUES (?, ?, ?, ?, ?, ?, ?)",
  );
  const insertModule = db.prepare(
    "INSERT INTO modules (track_slug, level, title, summary, position) VALUES (?, ?, ?, ?, ?)",
  );
  const insertLesson = db.prepare("INSERT INTO lessons (module_id, title, body, position) VALUES (?, ?, ?, ?)");
  const insertExercise = db.prepare(
    `INSERT INTO exercises (
      slug, track_slug, level, title, prompt, illustration, type, payload, answer, hint, explanation, position
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  );
  const insertTool = db.prepare("INSERT INTO tools (slug, name, layer, summary, track_slug) VALUES (?, ?, ?, ?, ?)");

  db.exec("BEGIN");
  try {
    db.exec("DELETE FROM attempts");
    db.exec("DELETE FROM lessons");
    db.exec("DELETE FROM modules");
    db.exec("DELETE FROM exercises");
    db.exec("DELETE FROM tools");
    db.exec("DELETE FROM tracks");

    for (const track of tracks) {
      insertTrack.run(track.slug, track.name, track.stack, track.summary, track.promise, track.aside, track.color);
      track.modules.forEach((module, moduleIndex) => {
        const inserted = insertModule.run(track.slug, module.level, module.title, module.summary, moduleIndex + 1);
        const moduleId = Number(inserted.lastInsertRowid);
        module.lessons.forEach((lesson, lessonIndex) => {
          insertLesson.run(moduleId, lesson.title, lesson.paragraphs.join("\n\n"), lessonIndex + 1);
        });
      });
    }

    for (const exercise of exercises) {
      insertExercise.run(
        exercise.slug,
        exercise.track,
        exercise.level,
        exercise.title,
        exercise.prompt,
        exercise.illustration,
        exercise.type,
        JSON.stringify(exercise.payload),
        JSON.stringify(exercise.answer),
        exercise.hint,
        exercise.explanation,
        exercise.position,
      );
    }

    for (const tool of tools) {
      insertTool.run(tool.slug, tool.name, tool.layer, tool.summary, tool.track);
    }

    db.prepare(
      "INSERT INTO meta (key, value) VALUES ('content_version', ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value",
    ).run(CONTENT_VERSION);
    db.exec("COMMIT");
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

function syncTracksFromSeed(): void {
  const count = db.prepare("SELECT COUNT(*) AS n FROM tracks").get() as { n: number };
  if (Number(count.n) === 0) {
    return;
  }
  const update = db.prepare(
    "UPDATE tracks SET name = ?, stack = ?, summary = ?, promise = ?, aside = ?, color = ? WHERE slug = ?",
  );
  for (const track of tracks) {
    update.run(track.name, track.stack, track.summary, track.promise, track.aside, track.color, track.slug);
  }
}

seed();
syncTracksFromSeed();

export function getOverview() {
  return {
    tracks: countOf("tracks"),
    lessons: countOf("lessons"),
    exercises: countOf("exercises"),
    tools: countOf("tools"),
    engine: "SQLite",
  };
}

export function listTracks() {
  return (
    db
      .prepare(
        `SELECT slug, name, stack, summary, promise, color FROM tracks
         ORDER BY CASE slug WHEN 'mern' THEN 1 WHEN 'mean' THEN 2 WHEN 'lamp' THEN 3 WHEN 'dotnet' THEN 4 ELSE 5 END`,
      )
      .all() as {
      slug: string;
      name: string;
      stack: string;
      summary: string;
      promise: string;
      color: string;
    }[]
  ).map((track) => ({
    slug: asPillar(track.slug),
    name: track.name,
    stack: track.stack,
    summary: track.summary,
    promise: track.promise,
    color: track.color,
  }));
}

export function getTrack(slug: string) {
  const track = db
    .prepare("SELECT slug, name, stack, summary, promise, aside, color FROM tracks WHERE slug = ?")
    .get(slug) as
    | {
        slug: string;
        name: string;
        stack: string;
        summary: string;
        promise: string;
        aside: string;
        color: string;
      }
    | undefined;
  if (!track) {
    return null;
  }

  const modules = db
    .prepare("SELECT id, level, title, summary FROM modules WHERE track_slug = ? ORDER BY position")
    .all(slug) as { id: number; level: string; title: string; summary: string }[];

  const lessons =
    modules.length === 0
      ? []
      : (db
          .prepare(
            `SELECT id, module_id, title, body FROM lessons WHERE module_id IN (${modules.map(() => "?").join(", ")}) ORDER BY position`,
          )
          .all(...modules.map((module) => module.id)) as { id: number; module_id: number; title: string; body: string }[]);

  const related = db
    .prepare("SELECT slug, title, level FROM exercises WHERE track_slug = ? ORDER BY position")
    .all(slug) as { slug: string; title: string; level: string }[];

  return {
    slug: asPillar(track.slug),
    name: track.name,
    stack: track.stack,
    summary: track.summary,
    promise: track.promise,
    aside: track.aside,
    color: track.color,
    modules: modules.map((module) => ({
      id: module.id,
      level: asLevel(module.level),
      title: module.title,
      summary: module.summary,
      lessons: lessons
        .filter((lesson) => lesson.module_id === module.id)
        .map((lesson) => ({
          id: lesson.id,
          title: lesson.title,
          paragraphs: lesson.body.split("\n\n"),
        })),
    })),
    exercises: related.map((exercise) => ({
      slug: exercise.slug,
      title: exercise.title,
      level: asLevel(exercise.level),
    })),
  };
}

type ExerciseRow = {
  id: number;
  slug: string;
  title: string;
  prompt: string;
  illustration: string;
  type: string;
  level: string;
  payload: string;
  track_slug: string;
  track_name: string;
  solved: number;
  answer?: string;
  hint?: string;
  explanation?: string;
};

function exerciseQuery(withSecret: boolean): string {
  const secret = withSecret ? ", e.answer, e.hint, e.explanation" : "";
  return `
    SELECT e.id, e.slug, e.title, e.prompt, e.illustration, e.type, e.level, e.payload,
      e.track_slug, t.name AS track_name,
      EXISTS(
        SELECT 1 FROM attempts a
        WHERE a.exercise_id = e.id AND a.student_id = ? AND a.correct = 1
      ) AS solved
      ${secret}
    FROM exercises e
    JOIN tracks t ON t.slug = e.track_slug
  `;
}

function mapExercise(row: ExerciseRow) {
  return {
    slug: row.slug,
    title: row.title,
    prompt: row.prompt,
    illustration: row.illustration,
    type: asExerciseType(row.type),
    level: asLevel(row.level),
    trackSlug: asPillar(row.track_slug),
    trackName: row.track_name,
    solved: row.solved === 1,
    payload: JSON.parse(row.payload) as unknown,
  };
}

export function listExercises(studentId: number | null) {
  const rows = db.prepare(`${exerciseQuery(false)} ORDER BY e.position`).all(studentId ?? 0) as ExerciseRow[];
  return rows.map((row) => mapExercise(row));
}

export function getExercise(slug: string, studentId: number | null) {
  const row = db.prepare(`${exerciseQuery(false)} WHERE e.slug = ?`).get(studentId ?? 0, slug) as ExerciseRow | undefined;
  return row ? mapExercise(row) : null;
}

export function getExerciseSecret(slug: string) {
  const row = db
    .prepare("SELECT id, type, answer, hint, explanation FROM exercises WHERE slug = ?")
    .get(slug) as { id: number; type: string; answer: string; hint: string; explanation: string } | undefined;
  if (!row) {
    return null;
  }
  return {
    id: row.id,
    type: asExerciseType(row.type),
    answer: row.answer,
    hint: row.hint,
    explanation: row.explanation,
  };
}

export function recordAttempt(studentId: number, exerciseId: number, correct: boolean): void {
  db.prepare("INSERT INTO attempts (student_id, exercise_id, correct, created_at) VALUES (?, ?, ?, ?)").run(
    studentId,
    exerciseId,
    correct ? 1 : 0,
    new Date().toISOString(),
  );
}

export function listTools() {
  return (
    db.prepare("SELECT slug, name, layer, summary, track_slug FROM tools ORDER BY rowid").all() as {
      slug: string;
      name: string;
      layer: string;
      summary: string;
      track_slug: string | null;
    }[]
  ).map((tool) => ({
    slug: tool.slug,
    name: tool.name,
    layer: tool.layer,
    summary: tool.summary,
    track: tool.track_slug ? asPillar(tool.track_slug) : null,
  }));
}

export function getSchema() {
  return tableNames.map((name) => {
    const columns = readColumns(name);
    return { name, count: countOf(name), columns };
  });
}

function readColumns(name: TableName) {
  switch (name) {
    case "students":
    case "tracks":
    case "modules":
    case "lessons":
    case "exercises":
    case "attempts":
    case "study_sessions":
    case "tools": {
      const rows = db.prepare(`PRAGMA table_info(${name})`).all() as {
        name: string;
        type: string;
        pk: number;
        notnull: number;
      }[];
      return rows.map((column) => ({
        name: column.name,
        type: column.type,
        primaryKey: column.pk === 1,
        required: column.notnull === 1,
      }));
    }
    default: {
      const unknown: never = name;
      throw new Error(unknown);
    }
  }
}

export function createStudent(input: {
  name: string;
  email: string;
  passwordHash: string;
  level: Level;
  pillar: Pillar;
  goal: string;
}): Student {
  const createdAt = new Date().toISOString();
  const result = db
    .prepare(
      "INSERT INTO students (name, email, password_hash, level, pillar, goal, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
    )
    .run(input.name, input.email, input.passwordHash, input.level, input.pillar, input.goal, createdAt);
  return {
    id: Number(result.lastInsertRowid),
    name: input.name,
    email: input.email,
    level: input.level,
    pillar: input.pillar,
    goal: input.goal,
    createdAt,
  };
}

export function findStudentByEmail(email: string): (Student & { passwordHash: string }) | null {
  const row = db.prepare("SELECT * FROM students WHERE email = ?").get(email) as StudentRow | undefined;
  if (!row) {
    return null;
  }
  return { ...mapStudent(row), passwordHash: row.password_hash };
}

export function findStudentById(id: number): Student | null {
  const row = db.prepare("SELECT * FROM students WHERE id = ?").get(id) as StudentRow | undefined;
  return row ? mapStudent(row) : null;
}

export function getProgress(studentId: number) {
  const solved = db
    .prepare("SELECT COUNT(DISTINCT exercise_id) AS n FROM attempts WHERE student_id = ? AND correct = 1")
    .get(studentId) as { n: number };
  const minutes = db.prepare("SELECT COALESCE(SUM(minutes), 0) AS n FROM study_sessions WHERE student_id = ?").get(studentId) as {
    n: number;
  };
  const sessions = db.prepare("SELECT COUNT(*) AS n FROM study_sessions WHERE student_id = ?").get(studentId) as { n: number };
  return {
    solved: Number(solved.n),
    total: countOf("exercises"),
    minutes: Number(minutes.n),
    sessions: Number(sessions.n),
  };
}

export function getStudyPlan(pillar: Pillar | null) {
  const slug = pillar ?? "mern";
  const track = db.prepare("SELECT slug, name FROM tracks WHERE slug = ?").get(slug) as { slug: string; name: string } | undefined;
  if (!track) {
    return null;
  }
  const tasks = db
    .prepare(
      `SELECT lessons.title AS title, modules.level AS level, modules.title AS module
       FROM lessons
       JOIN modules ON modules.id = lessons.module_id
       WHERE modules.track_slug = ?
       ORDER BY modules.position, lessons.position
       LIMIT 3`,
    )
    .all(slug) as { title: string; level: string; module: string }[];
  return {
    personalized: pillar !== null,
    track: { slug: asPillar(track.slug), name: track.name },
    tasks: tasks.map((task) => ({
      title: task.title,
      level: asLevel(task.level),
      module: task.module,
    })),
    quotes,
  };
}

export function listSessions(studentId: number) {
  return (
    db
      .prepare(
        `SELECT s.id, s.minutes, s.note, s.created_at, s.track_slug, COALESCE(t.name, s.track_slug) AS track_name
         FROM study_sessions s
         LEFT JOIN tracks t ON t.slug = s.track_slug
         WHERE s.student_id = ?
         ORDER BY s.id DESC
         LIMIT 12`,
      )
      .all(studentId) as {
      id: number;
      minutes: number;
      note: string;
      created_at: string;
      track_slug: string;
      track_name: string;
    }[]
  ).map((session) => ({
    id: session.id,
    minutes: session.minutes,
    note: session.note,
    createdAt: session.created_at,
    trackSlug: session.track_slug,
    trackName: session.track_name,
  }));
}

export function addSession(studentId: number, pillar: Pillar, minutes: number, note: string) {
  const createdAt = new Date().toISOString();
  const result = db
    .prepare("INSERT INTO study_sessions (student_id, track_slug, minutes, note, created_at) VALUES (?, ?, ?, ?, ?)")
    .run(studentId, pillar, minutes, note, createdAt);
  const track = db.prepare("SELECT name FROM tracks WHERE slug = ?").get(pillar) as { name: string } | undefined;
  return {
    id: Number(result.lastInsertRowid),
    minutes,
    note,
    createdAt,
    trackSlug: pillar,
    trackName: track?.name ?? pillar,
  };
}
