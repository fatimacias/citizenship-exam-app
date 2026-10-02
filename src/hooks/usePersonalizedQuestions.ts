import { useMemo } from "react";
import type { ExamVersion } from "../types";
import { getQuestionsForVersion } from "../data";
import { personalizeQuestions } from "../data/personalize";
import { useCivicsProfile } from "./useCivicsProfile";

/**
 * Questions for a version with personalized "answers vary" questions
 * (state officials, current federal officeholders) resolved from the
 * user's saved civics profile, wherever they've filled one in.
 */
export function usePersonalizedQuestions(version: ExamVersion) {
  const { resolveField, completeness } = useCivicsProfile();
  const questions = useMemo(
    () => personalizeQuestions(getQuestionsForVersion(version), resolveField),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [version, resolveField]
  );
  return { questions, completeness };
}
