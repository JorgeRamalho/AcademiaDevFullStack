export type Level = "iniciante" | "intermediario" | "avancado";
export type Pillar = "mern" | "mean" | "lamp" | "dotnet";
export type ToolLayer = "front" | "back" | "data" | "infra";
export type ExerciseType = "choice" | "fill" | "order";
export type IllustrationKind = "skeleton" | "flex" | "code" | "types" | "tree" | "flow" | "table" | "stack" | "lock";

export type Student = {
  id: number;
  name: string;
  email: string;
  level: Level;
  pillar: Pillar;
  goal: string;
  createdAt: string;
};

export type Overview = {
  tracks: number;
  lessons: number;
  exercises: number;
  tools: number;
  engine: string;
};

export type TrackSummary = {
  slug: Pillar;
  name: string;
  stack: string;
  summary: string;
  promise: string;
  color: string;
};

export type Lesson = {
  id: number;
  title: string;
  paragraphs: string[];
};

export type Module = {
  id: number;
  level: Level;
  title: string;
  summary: string;
  lessons: Lesson[];
};

export type TrackDetail = TrackSummary & {
  aside: string;
  modules: Module[];
  exercises: { slug: string; title: string; level: Level }[];
};

export type ChoicePayload = { options: { id: string; label: string }[] };
export type FillPayload = { label: string; placeholder: string };
export type OrderPayload = { items: { id: string; label: string }[]; initial: string[] };

type ExerciseBase = {
  slug: string;
  title: string;
  prompt: string;
  illustration: string;
  level: Level;
  trackSlug: Pillar;
  trackName: string;
  solved: boolean;
};

export type ExerciseDetail =
  | (ExerciseBase & { type: "choice"; payload: ChoicePayload })
  | (ExerciseBase & { type: "fill"; payload: FillPayload })
  | (ExerciseBase & { type: "order"; payload: OrderPayload });

export type Tool = {
  slug: string;
  name: string;
  layer: ToolLayer;
  summary: string;
  track: Pillar | null;
};

export type SchemaColumn = {
  name: string;
  type: string;
  primaryKey: boolean;
  required: boolean;
};

export type SchemaTable = {
  name: string;
  count: number;
  columns: SchemaColumn[];
};

export type SchemaResponse = {
  engine: string;
  note: string;
  tables: SchemaTable[];
};

export type StudyPlan = {
  personalized: boolean;
  track: { slug: Pillar; name: string };
  tasks: { title: string; level: Level; module: string }[];
  quotes: string[];
};

export type StudySession = {
  id: number;
  minutes: number;
  note: string;
  createdAt: string;
  trackSlug: string;
  trackName: string;
};

export type Progress = {
  solved: number;
  total: number;
  minutes: number;
  sessions: number;
};

export type AttemptResult = {
  correct: boolean;
  explanation: string;
  hint: string | null;
  saved: boolean;
};

export type AuthResponse = {
  token: string;
  student: Student;
};
