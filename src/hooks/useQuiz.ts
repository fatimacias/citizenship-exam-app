import { useCallback, useMemo, useState } from "react";
import type { CivicsQuestion } from "../types";

/** Fisher-Yates shuffle, returns a new array. */
export function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export interface UseQuizOptions {
  questions: CivicsQuestion[];
  shuffleQuestions?: boolean;
}

/**
 * Generic quiz session state machine: tracks current question index,
 * session score, and exposes next/prev navigation. Scoring/persistence
 * side effects (localStorage) are left to the caller via onAnswer, so
 * this hook stays decoupled from useProgress.
 */
export function useQuiz({ questions, shuffleQuestions = true }: UseQuizOptions) {
  const orderedQuestions = useMemo(
    () => (shuffleQuestions ? shuffle(questions) : questions),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [questions]
  );

  const [index, setIndex] = useState(0);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionIncorrect, setSessionIncorrect] = useState(0);

  const currentQuestion = orderedQuestions[index];
  const isLastQuestion = index >= orderedQuestions.length - 1;

  const answer = useCallback((correct: boolean) => {
    if (correct) setSessionCorrect((c) => c + 1);
    else setSessionIncorrect((c) => c + 1);
  }, []);

  const next = useCallback(() => {
    setIndex((i) => Math.min(i + 1, orderedQuestions.length - 1));
  }, [orderedQuestions.length]);

  const restart = useCallback(() => {
    setIndex(0);
    setSessionCorrect(0);
    setSessionIncorrect(0);
  }, []);

  return {
    questions: orderedQuestions,
    currentQuestion,
    index,
    total: orderedQuestions.length,
    isLastQuestion,
    sessionCorrect,
    sessionIncorrect,
    answer,
    next,
    restart,
  };
}
