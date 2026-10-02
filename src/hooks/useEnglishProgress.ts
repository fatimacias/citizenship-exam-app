import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "citizenship-exam-english-progress-v1";

export type EnglishMode = "vocab-reading" | "vocab-writing" | "reading" | "writing";

interface EnglishProgressState {
  /** Sentence/word ids the user has self-marked as mastered, per mode. */
  masteredIds: Partial<Record<EnglishMode, string[]>>;
  /** Simple correct/incorrect tally per mode (used by the writing dictation). */
  stats: Partial<Record<EnglishMode, { correct: number; incorrect: number }>>;
}

function emptyState(): EnglishProgressState {
  return { masteredIds: {}, stats: {} };
}

function load(): EnglishProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();
    return { ...emptyState(), ...(JSON.parse(raw) as EnglishProgressState) };
  } catch {
    return emptyState();
  }
}

function save(state: EnglishProgressState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage unavailable - fail silently.
  }
}

/** Lightweight localStorage-backed progress tracker for the English module. */
export function useEnglishProgress() {
  const [state, setState] = useState<EnglishProgressState>(() => load());

  useEffect(() => {
    save(state);
  }, [state]);

  const isMastered = useCallback(
    (mode: EnglishMode, id: string) => (state.masteredIds[mode] ?? []).includes(id),
    [state]
  );

  const toggleMastered = useCallback((mode: EnglishMode, id: string) => {
    setState((prev) => {
      const current = prev.masteredIds[mode] ?? [];
      const next = current.includes(id)
        ? current.filter((existing) => existing !== id)
        : [...current, id];
      return { ...prev, masteredIds: { ...prev.masteredIds, [mode]: next } };
    });
  }, []);

  const recordAttempt = useCallback((mode: EnglishMode, correct: boolean) => {
    setState((prev) => {
      const existing = prev.stats[mode] ?? { correct: 0, incorrect: 0 };
      const next = {
        correct: existing.correct + (correct ? 1 : 0),
        incorrect: existing.incorrect + (correct ? 0 : 1),
      };
      return { ...prev, stats: { ...prev.stats, [mode]: next } };
    });
  }, []);

  const getMasteredCount = useCallback(
    (mode: EnglishMode) => (state.masteredIds[mode] ?? []).length,
    [state]
  );

  const getStats = useCallback(
    (mode: EnglishMode) => state.stats[mode] ?? { correct: 0, incorrect: 0 },
    [state]
  );

  return { isMastered, toggleMastered, recordAttempt, getMasteredCount, getStats };
}
