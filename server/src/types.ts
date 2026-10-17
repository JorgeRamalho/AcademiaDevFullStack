export const levels = ["iniciante", "intermediario", "avancado"] as const;
export type Level = (typeof levels)[number];

export const pillars = ["mern", "mean", "lamp", "dotnet"] as const;
export type Pillar = (typeof pillars)[number];

export const exerciseTypes = ["choice", "fill", "order"] as const;
export type ExerciseType = (typeof exerciseTypes)[number];

export const toolLayers = ["front", "back", "data", "infra"] as const;
export type ToolLayer = (typeof toolLayers)[number];

export const illustrationKinds = [
  "skeleton",
  "flex",
  "code",
  "types",
  "tree",
  "flow",
  "table",
  "stack",
  "lock",
] as const;
export type IllustrationKind = (typeof illustrationKinds)[number];

export type Student = {
  id: number;
  name: string;
  email: string;
  level: Level;
  pillar: Pillar;
  goal: string;
  createdAt: string;
};

export type ChoicePayload = {
  options: { id: string; label: string }[];
};

export type FillPayload = {
  label: string;
  placeholder: string;
};

export type OrderPayload = {
  items: { id: string; label: string }[];
  initial: string[];
};

export type ExercisePayload = ChoicePayload | FillPayload | OrderPayload;

export type LessonSeed = {
  title: string;
  paragraphs: string[];
};

export type ModuleSeed = {
  level: Level;
  title: string;
  summary: string;
  lessons: LessonSeed[];
};

export type TrackSeed = {
  slug: Pillar;
  name: string;
  stack: string;
  summary: string;
  promise: string;
  aside: string;
  color: string;
  modules: ModuleSeed[];
};

export type ExerciseSeed = {
  slug: string;
  track: Pillar;
  level: Level;
  title: string;
  prompt: string;
  illustration: IllustrationKind;
  hint: string;
  explanation: string;
  position: number;
} & (
  | { type: "choice"; payload: ChoicePayload; answer: string }
  | { type: "fill"; payload: FillPayload; answer: string }
  | { type: "order"; payload: OrderPayload; answer: string[] }
);

export type ToolSeed = {
  slug: string;
  name: string;
  layer: ToolLayer;
  summary: string;
  track: Pillar | null;
};
