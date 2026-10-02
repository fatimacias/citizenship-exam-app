import { useCallback, useMemo, useState } from "react";
import type { CivicsQuestion } from "../types";
import type { ExamRules } from "../data";
import { shuffle } from "./useQuiz";

export interface UseExamSessionOptions {
  questions: CivicsQuestion[];
  rules: ExamRules;
}

/**
 * Simulates a real USCIS civics interview session: draws a random subset of
 * questions (size = rules.askCount, or the whole pool if smaller) and stops
 * as soon as the pass/fail outcome is certain — exactly like the real exam,
 * which doesn't keep asking once you've gotten enough right or wrong.
 */
export function useExamSession({ questions, rules }: UseExamSessionOptions) {
  // Bumping this reshuffles and draws a brand-new random set of questions.
  const [sessionId, setSessionId] = useState(0);

  const examQuestions = useMemo(
    () => shuffle(questions).slice(0, Math.min(rules.askCount, questions.length)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [questions, rules.askCount, sessionId]
  );

  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [answered, setAnswered] = useState(false);

  const askCount = examQuestions.length;
  const currentQuestion = examQuestions[index];

  // The real exam stops the moment the outcome is decided, so passing or
  // failing can happen before every drawn question is asked.
  const passed = correct >= rules.passThreshold;
  const failed = incorrect >= rules.failThreshold;
  const decided = passed || failed;
  const isLastQuestion = index >= askCount - 1;
  const isFinished = decided || (isLastQuestion && answered);

  const answer = useCallback(
    (isCorrect: boolean) => {
      if (answered) return;
      setAnswered(true);
      if (isCorrect) setCorrect((c) => c + 1);
      else setIncorrect((c) => c + 1);
    },
    [answered]
  );

  const next = useCallback(() => {
    if (decided) return;
    setIndex((i) => Math.min(i + 1, askCount - 1));
    setAnswered(false);
  }, [askCount, decided]);

  const restart = useCallback(() => {
    setSessionId((id) => id + 1);
    setIndex(0);
    setCorrect(0);
    setIncorrect(0);
    setAnswered(false);
  }, []);

  return {
    questions: examQuestions,
    currentQuestion,
    index,
    askCount,
    passThreshold: rules.passThreshold,
    correct,
    incorrect,
    answered,
    passed,
    isFinished,
    answer,
    next,
    restart,
  };
}
