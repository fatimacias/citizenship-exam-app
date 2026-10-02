// Core domain types for the civics exam study app.
// Keeping these decoupled from UI/data so a future backend/auth layer
// (v2) can reuse the same shapes without rewriting components.

/** Which official USCIS question set a question belongs to. */
export type ExamVersion = "2025" | "2008" | "65-20";

/** Broad USCIS civics category. */
export type QuestionCategory =
  | "American Government"
  | "American History"
  | "Integrated Civics";

/** A single civics question with one or more acceptable answers. */
export interface CivicsQuestion {
  /** Stable unique id, e.g. "q2008-01" or "q2025-001". */
  id: string;
  /** Question text in English. */
  question: string;
  /** Optional Spanish translation of the question. */
  questionEs?: string;
  /** One or more acceptable answers (any one is correct). */
  answers: string[];
  /** Optional Spanish translation(s) of the answer(s), same order as answers. */
  answersEs?: string[];
  category: QuestionCategory;
  /** Which full exam lists include this question. */
  versions: ExamVersion[];
  /**
   * If true, this question is part of the official 65-years-old /
   * 20-years-permanent-resident 20-question subset. Such questions are
   * referenced from the 100/128 lists rather than duplicated.
   */
  isSpecial65_20?: boolean;
  /**
   * Note shown to the user about answers that change over time
   * (e.g. "current" senator/representative/governor) so free-text
   * validation can be more lenient.
   */
  answerChangesOverTime?: boolean;
}

/** The four study levels/modes a user can pick, independent of version. */
export type StudyLevel = 0 | 1 | 2 | 3;

export const STUDY_LEVELS: { level: StudyLevel; name: string; description: string }[] = [
  { level: 0, name: "Flashcards", description: "Flip cards to memorize questions and answers." },
  { level: 1, name: "Multiple Choice", description: "Pick the correct answer among several options." },
  { level: 2, name: "Matching", description: "Match questions to their answers." },
  { level: 3, name: "Write the Answer", description: "Type the answer from memory." },
];

/** Per-question outcome recorded during a quiz session. */
export interface QuestionAttempt {
  questionId: string;
  correct: boolean;
  timestamp: number;
}

/** Progress stats tracked per exam-version + level combination. */
export interface LevelProgress {
  correctCount: number;
  incorrectCount: number;
  currentStreak: number;
  bestStreak: number;
  /** IDs of questions most recently answered incorrectly, for review. */
  missedQuestionIds: string[];
  lastPlayedAt?: number;
}

/** Full progress state persisted to localStorage. */
export type ProgressState = {
  [versionLevelKey: string]: LevelProgress;
};

export function progressKey(version: ExamVersion, level: StudyLevel): string {
  return `${version}:${level}`;
}
