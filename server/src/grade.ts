import type { ExerciseType } from "./types.js";

function normalize(value: string): string {
  return value.trim().toLowerCase();
}

export function gradeAnswer(type: ExerciseType, expectedJson: string, submission: unknown): boolean {
  const expected: unknown = JSON.parse(expectedJson);
  switch (type) {
    case "choice":
      return typeof submission === "string" && submission === expected;
    case "fill":
      return typeof submission === "string" && typeof expected === "string" && normalize(submission) === normalize(expected);
    case "order":
      return (
        Array.isArray(submission) &&
        Array.isArray(expected) &&
        submission.every((item) => typeof item === "string") &&
        submission.join("|") === expected.join("|")
      );
    default: {
      const unknown: never = type;
      throw new Error(`Tipo de exercício desconhecido: ${String(unknown)}`);
    }
  }
}
