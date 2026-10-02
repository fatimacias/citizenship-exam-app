import { useCallback, useLayoutEffect, useRef, useState } from "react";
import type { CivicsQuestion, ExamVersion, StudyLevel } from "../types";
import type { ExamRules } from "../data";
import { useQuestionCycle } from "./useQuestionCycle";

export interface UseExamSessionOptions {
  questions: CivicsQuestion[];
  rules: ExamRules;
  version: ExamVersion;
  level: StudyLevel;
}

/**
 * Simulates a real USCIS civics interview session: draws a random subset of
 * questions (size = rules.askCount, or the whole pool if smaller) and stops
 * as soon as the pass/fail outcome is certain — exactly like the real exam,
 * which doesn't keep asking once you've gotten enough right or wrong.
 *
 * Questions are drawn from a persisted "shuffle bag" (useQuestionCycle) so
 * that every question in the pool gets practiced before any question is
 * repeated, across sessions. Any drawn questions that never actually get
 * shown (because the session ended early on a pass/fail decision, or the
 * user navigates away) are released back to the front of the queue so they
 * aren't silently skipped.
 */
export function useExamSession({ questions, rules, version, level }: UseExamSessionOptions) {
  const { draw, release } = useQuestionCycle(version, level, questions);

  // Bumping this draws a brand-new batch of questions for a fresh attempt.
  const [sessionId, setSessionId] = useState(0);
  const [examQuestions, setExamQuestions] = useState<CivicsQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [answered, setAnswered] = useState(false);

  // Tracks, for the *current* drawn batch, how many questions from the
  // front have actually been asked/answered - the rest get released if the
  // session ends (or the component unmounts) before reaching them.
  const batchRef = useRef<{ ids: string[]; consumedUpTo: number }>({ ids: [], consumedUpTo: 0 });

  useLayoutEffect(() => {
    const count = Math.min(rules.askCount, questions.length);
    const drawn = draw(count);
    batchRef.current = { ids: drawn.map((q) => q.id), consumedUpTo: 0 };
    setExamQuestions(drawn);
    setIndex(0);
    setCorrect(0);
    setIncorrect(0);
    setAnswered(false);

    return () => {
      const { ids, consumedUpTo } = batchRef.current;
      release(ids.slice(consumedUpTo));
    };
    // `draw`/`release` intentionally excluded: their identity changes after
    // every call (they persist to localStorage), which would otherwise
    // redraw forever. Re-running only on an actual new attempt/version/level
    // is what we want.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, version, level, questions, rules.askCount]);

  const askCount = examQuestions.length;
  const currentQuestion = examQuestions[index];

  // The real exam stops the moment the outcome is decided, so passing or
  // failing can happen before every drawn question is asked.
  const passed = correct >= rules.passThreshold;
  const failed = incorrect >= rules.failThreshold;
  const decided = passed || failed;
  const isLastQuestion = index >= askCount - 1;
  const isFinished = askCount > 0 && (decided || (isLastQuestion && answered));

  const answer = useCallback(
    (isCorrect: boolean) => {
      if (answered) return;
      setAnswered(true);
      batchRef.current.consumedUpTo = Math.max(batchRef.current.consumedUpTo, index + 1);
      if (isCorrect) setCorrect((c) => c + 1);
      else setIncorrect((c) => c + 1);
    },
    [answered, index]
  );

  const next = useCallback(() => {
    if (decided) return;
    setIndex((i) => Math.min(i + 1, askCount - 1));
    setAnswered(false);
  }, [askCount, decided]);

  const restart = useCallback(() => {
    setSessionId((id) => id + 1);
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
