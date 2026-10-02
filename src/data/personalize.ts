import type { CivicsQuestion } from "../types";

/** A function that resolves a personalize field to its real text answer, or null if unset. */
export type FieldResolver = (field: NonNullable<CivicsQuestion["personalizeField"]>) => string | null;

/**
 * Replaces the generic "answers vary" placeholder on personalized questions
 * (state officials, current federal officeholders) with the user's own
 * saved answer, wherever one has been provided. Questions without a
 * resolved value are left untouched (still showing the placeholder) so the
 * UI can prompt the user to fill in their profile.
 */
export function personalizeQuestions(questions: CivicsQuestion[], resolveField: FieldResolver): CivicsQuestion[] {
  return questions.map((q) => {
    if (!q.personalizeField) return q;
    const resolved = resolveField(q.personalizeField);
    if (!resolved) return q;
    return { ...q, answers: [resolved], answerChangesOverTime: false };
  });
}
