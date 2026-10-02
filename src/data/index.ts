import type { CivicsQuestion, ExamVersion } from "../types";
import { QUESTIONS_100 } from "./questions100";
import { QUESTIONS_128 } from "./questions128";

export { QUESTIONS_100, QUESTIONS_128 };

/** All questions from both official lists, deduplicated by id. */
export const ALL_QUESTIONS: CivicsQuestion[] = [...QUESTIONS_100, ...QUESTIONS_128];

export const EXAM_VERSION_LABELS: Record<ExamVersion, string> = {
  "2025": "2025 Version (128 Questions)",
  "2008": "2008 Version (100 Questions)",
  "65-20": "65/20 Special Consideration (20 Questions)",
};

export const EXAM_VERSION_DESCRIPTIONS: Record<ExamVersion, string> = {
  "2025": "Current version for Form N-400 filed on or after October 20, 2025. Up to 20 oral questions; pass with 12/20 correct.",
  "2008": "Previous version, still used for applicants who filed before October 20, 2025. Up to 10 oral questions; pass with 6/10 correct.",
  "65-20":
    "For applicants 65+ who have been permanent residents 20+ years. A 20-question subset; pass with 6/10 correct.",
};

/**
 * Returns the question list for a given exam version.
 * "65-20" returns the official 20-question subset, sourced from the 2025
 * list (the current official list) by referencing isSpecial65_20 flags
 * rather than duplicating question data.
 */
export function getQuestionsForVersion(version: ExamVersion): CivicsQuestion[] {
  if (version === "2025") return QUESTIONS_128;
  if (version === "2008") return QUESTIONS_100;
  // 65-20: the official subset, taken from the current (2025) list.
  return QUESTIONS_128.filter((q) => q.isSpecial65_20);
}

export function getQuestionById(id: string): CivicsQuestion | undefined {
  return ALL_QUESTIONS.find((q) => q.id === id);
}
