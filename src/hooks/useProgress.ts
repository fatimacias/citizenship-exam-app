import { useCallback, useEffect, useState } from "react";
import type { ExamVersion, LevelProgress, ProgressState, StudyLevel } from "../types";
import { progressKey } from "../types";

const STORAGE_KEY = "citizenship-exam-progress-v1";

function emptyLevelProgress(): LevelProgress {
  return {
    correctCount: 0,
    incorrectCount: 0,
    currentStreak: 0,
    bestStreak: 0,
    missedQuestionIds: [],
  };
}

function loadProgress(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as ProgressState;
  } catch {
    return {};
  }
}

function saveProgress(state: ProgressState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage unavailable (private mode, quota, etc.) - fail silently.
  }
}

/**
 * Hook for reading/writing per (exam version, level) progress stats to
 * localStorage. No backend/auth in v1 - everything lives in the browser.
 */
export function useProgress() {
  const [state, setState] = useState<ProgressState>(() => loadProgress());

  useEffect(() => {
    saveProgress(state);
  }, [state]);

  const getLevelProgress = useCallback(
    (version: ExamVersion, level: StudyLevel): LevelProgress => {
      return state[progressKey(version, level)] ?? emptyLevelProgress();
    },
    [state]
  );

  const recordAnswer = useCallback(
    (version: ExamVersion, level: StudyLevel, questionId: string, correct: boolean) => {
      setState((prev) => {
        const key = progressKey(version, level);
        const existing = prev[key] ?? emptyLevelProgress();
        const currentStreak = correct ? existing.currentStreak + 1 : 0;
        const missedQuestionIds = correct
          ? existing.missedQuestionIds.filter((id) => id !== questionId)
          : existing.missedQuestionIds.includes(questionId)
          ? existing.missedQuestionIds
          : [...existing.missedQuestionIds, questionId];
        const next: LevelProgress = {
          correctCount: existing.correctCount + (correct ? 1 : 0),
          incorrectCount: existing.incorrectCount + (correct ? 0 : 1),
          currentStreak,
          bestStreak: Math.max(existing.bestStreak, currentStreak),
          missedQuestionIds,
          lastPlayedAt: Date.now(),
        };
        return { ...prev, [key]: next };
      });
    },
    []
  );

  const resetLevelProgress = useCallback((version: ExamVersion, level: StudyLevel) => {
    setState((prev) => {
      const key = progressKey(version, level);
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  const resetAllProgress = useCallback(() => {
    setState({});
  }, []);

  return { getLevelProgress, recordAnswer, resetLevelProgress, resetAllProgress };
}
