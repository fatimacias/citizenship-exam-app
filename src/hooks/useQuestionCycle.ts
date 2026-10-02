import { useCallback, useRef } from "react";
import type { CivicsQuestion, ExamVersion, StudyLevel } from "../types";
import { progressKey } from "../types";
import { shuffle } from "./useQuiz";

const STORAGE_KEY = "citizenship-exam-cycle-v1";

type CycleStore = {
  [versionLevelKey: string]: string[]; // remaining question ids in draw order
};

function loadStore(): CycleStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as CycleStore;
  } catch {
    return {};
  }
}

function saveStore(store: CycleStore) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // localStorage unavailable - fail silently, coverage just resets per load.
  }
}

/**
 * "Shuffle bag" cycle that guarantees every question in the pool gets
 * practiced at least once before any question repeats, across exam
 * sessions. Each draw() pulls the next `count` ids from a persisted,
 * shuffled queue (keyed by exam version + study level); once the queue
 * runs out mid-draw, it's reshuffled and refilled with the full pool so
 * drawing can continue seamlessly into the next cycle.
 *
 * Because a real-exam session can end early (pass/fail decided before all
 * drawn questions are asked), callers must release() any drawn-but-unused
 * ids so they go back to the front of the queue instead of being skipped.
 */
export function useQuestionCycle(
  version: ExamVersion,
  level: StudyLevel,
  pool: CivicsQuestion[]
) {
  const key = progressKey(version, level);
  // Store is only read/written as a side effect of draw()/release(); no
  // re-render is needed when it changes, so a ref avoids extra renders.
  const storeRef = useRef<CycleStore>(loadStore());

  const draw = useCallback(
    (count: number): CivicsQuestion[] => {
      const poolById = new Map(pool.map((q) => [q.id, q]));
      const poolIds = pool.map((q) => q.id);

      let queue = (storeRef.current[key] ?? []).filter((id) => poolById.has(id));

      const resultIds: string[] = [];
      const safetyLimit = count + poolIds.length; // guards against an empty pool looping forever
      let iterations = 0;
      while (resultIds.length < count && poolIds.length > 0 && iterations < safetyLimit) {
        iterations++;
        if (queue.length === 0) {
          queue = shuffle(poolIds);
        }
        const next = queue.shift();
        if (next !== undefined) resultIds.push(next);
      }

      storeRef.current = { ...storeRef.current, [key]: queue };
      saveStore(storeRef.current);

      return resultIds.map((id) => poolById.get(id)).filter((q): q is CivicsQuestion => !!q);
    },
    [key, pool]
  );

  /** Puts drawn-but-never-shown question ids back at the front of the queue. */
  const release = useCallback(
    (ids: string[]) => {
      if (ids.length === 0) return;
      const current = storeRef.current[key] ?? [];
      const toRelease = ids.filter((id) => !current.includes(id));
      if (toRelease.length === 0) return;
      storeRef.current = { ...storeRef.current, [key]: [...toRelease, ...current] };
      saveStore(storeRef.current);
    },
    [key]
  );

  return { draw, release };
}
