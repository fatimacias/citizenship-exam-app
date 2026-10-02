import { useCallback, useSyncExternalStore } from "react";
import type { PersonalizeField } from "../types";
import { getStateByName } from "../data/usStates";
import { CURRENT_FEDERAL_OFFICIALS, CURRENT_STATE_OFFICIALS } from "../data/currentOfficials";

/**
 * User-entered answers that resolve the "answers vary" personalized
 * questions. Fields for roles that change over time (elections, term
 * limits) also carry a "term end year" so the displayed answer can show
 * e.g. "Donald Trump (through 2028)" and the app can flag it as possibly
 * stale once that year has passed.
 */
export interface CivicsProfile {
  /** Full state name, matching an entry in US_STATES, or null if not set. */
  state: string | null;
  governor: string;
  governorTermEnd: string;
  senator1: string;
  senator1TermEnd: string;
  senator2: string;
  senator2TermEnd: string;
  representative: string;
  representativeTermEnd: string;
  president: string;
  presidentTermEnd: string;
  vicePresident: string;
  vicePresidentTermEnd: string;
  speakerOfHouse: string;
  speakerOfHouseTermEnd: string;
  /** Lifetime appointment — no term-end year needed. */
  chiefJustice: string;
  /** Tied to the sitting president's term; see presidentTermEnd. */
  presidentParty: string;
}

/** Fields that pair a name with a "valid through" term-end year. */
export const TIME_BOUND_FIELDS = [
  "governor",
  "senator1",
  "senator2",
  "representative",
  "president",
  "vicePresident",
  "speakerOfHouse",
] as const;

export type TimeBoundField = (typeof TIME_BOUND_FIELDS)[number];

const STORAGE_KEY = "citizenship-exam-civics-profile-v1";

export const EMPTY_PROFILE: CivicsProfile = {
  state: null,
  governor: "",
  governorTermEnd: "",
  senator1: "",
  senator1TermEnd: "",
  senator2: "",
  senator2TermEnd: "",
  representative: "",
  representativeTermEnd: "",
  president: "",
  presidentTermEnd: "",
  vicePresident: "",
  vicePresidentTermEnd: "",
  speakerOfHouse: "",
  speakerOfHouseTermEnd: "",
  chiefJustice: "",
  presidentParty: "",
};

function readStored(): CivicsProfile {
  if (typeof window === "undefined") return EMPTY_PROFILE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_PROFILE;
    return { ...EMPTY_PROFILE, ...JSON.parse(raw) };
  } catch {
    return EMPTY_PROFILE;
  }
}

/**
 * Tiny module-scoped store (outside React) so every component using
 * `useCivicsProfile` shares and reacts to the same live profile, instead
 * of each call holding its own disconnected copy that only syncs on
 * next mount. Backed by localStorage for persistence across reloads.
 */
let profileState: CivicsProfile = readStored();
const listeners = new Set<() => void>();

function setGlobalProfile(updater: (prev: CivicsProfile) => CivicsProfile) {
  profileState = updater(profileState);
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profileState));
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return profileState;
}

function formatWithTerm(name: string, termEnd: string): string {
  const year = termEnd.trim();
  if (!year) return name;
  return `${name} (through ${year})`;
}

export function isYearStale(termEnd: string): boolean {
  const year = Number(termEnd);
  if (!year) return false;
  return new Date().getFullYear() > year;
}

/**
 * Pure resolver: given a saved profile, returns the real term-annotated
 * answer text for a personalize-able field, or null if the user hasn't
 * filled it in yet. Usable both from the live hook and from one-off
 * exports (e.g. the question bank download) without a component.
 */
export function resolvePersonalizedAnswer(profile: CivicsProfile, field: PersonalizeField): string | null {
  if (field === "capital") {
    const state = profile.state ? getStateByName(profile.state) : undefined;
    return state ? state.capital : null;
  }
  if (field === "senator") {
    const parts = [
      profile.senator1 ? formatWithTerm(profile.senator1, profile.senator1TermEnd) : null,
      profile.senator2 ? formatWithTerm(profile.senator2, profile.senator2TermEnd) : null,
    ].filter((n): n is string => !!n);
    return parts.length > 0 ? parts.join(" or ") : null;
  }
  if (field === "presidentParty") {
    return profile.presidentParty.trim() ? formatWithTerm(profile.presidentParty, profile.presidentTermEnd) : null;
  }
  if (field === "chiefJustice") {
    return profile.chiefJustice.trim() || null;
  }
  const name = profile[field as TimeBoundField];
  if (!name || !name.trim()) return null;
  const termEnd = profile[`${field}TermEnd` as `${TimeBoundField}TermEnd`];
  return formatWithTerm(name, termEnd);
}

/**
 * Fills in officials/term-years from our reference data (fetched from
 * official sources at build time). Only overwrites fields that are still
 * blank unless `overwrite` is true — the user's own edits always win.
 */
function applyCurrentData(profile: CivicsProfile, overwrite: boolean, stateChanged = false): CivicsProfile {
  const next = { ...profile };
  const maybeSet = (key: TimeBoundField, name: string, termEnd: string, forceForThisKey = false) => {
    if (overwrite || forceForThisKey || !next[key].trim()) {
      next[key] = name;
      next[`${key}TermEnd` as `${TimeBoundField}TermEnd`] = termEnd;
    }
  };

  if (next.state) {
    const stateData = CURRENT_STATE_OFFICIALS[next.state];
    if (stateData) {
      // When the user just switched to a different state, state-specific
      // fields (governor/senators/at-large rep) must be refreshed even if
      // already filled in — otherwise they'd keep showing the *previous*
      // state's officials, which is wrong, not just "not yet personalized".
      maybeSet("governor", stateData.governor.name, stateData.governor.termEnd, stateChanged);
      maybeSet("senator1", stateData.senators[0].name, stateData.senators[0].termEnd, stateChanged);
      maybeSet("senator2", stateData.senators[1].name, stateData.senators[1].termEnd, stateChanged);
      if (stateData.representativeAtLarge) {
        maybeSet(
          "representative",
          stateData.representativeAtLarge.name,
          stateData.representativeAtLarge.termEnd,
          stateChanged
        );
      } else if (stateChanged) {
        // Previous state may have had an at-large rep that doesn't apply here.
        next.representative = "";
        next.representativeTermEnd = "";
      }
    }
  }

  maybeSet("president", CURRENT_FEDERAL_OFFICIALS.president.name, CURRENT_FEDERAL_OFFICIALS.president.termEnd);
  maybeSet("vicePresident", CURRENT_FEDERAL_OFFICIALS.vicePresident.name, CURRENT_FEDERAL_OFFICIALS.vicePresident.termEnd);
  maybeSet(
    "speakerOfHouse",
    CURRENT_FEDERAL_OFFICIALS.speakerOfHouse.name,
    CURRENT_FEDERAL_OFFICIALS.speakerOfHouse.termEnd
  );
  if (overwrite || !next.chiefJustice.trim()) next.chiefJustice = CURRENT_FEDERAL_OFFICIALS.chiefJustice;
  if (overwrite || !next.presidentParty.trim()) next.presidentParty = CURRENT_FEDERAL_OFFICIALS.presidentParty;

  return next;
}

/** Persisted "my answers" profile used to resolve personalized civics questions. */
export function useCivicsProfile() {
  const profile = useSyncExternalStore(subscribe, getSnapshot, () => EMPTY_PROFILE);

  const setProfile = useCallback((update: Partial<CivicsProfile>) => {
    setGlobalProfile((prev) => ({ ...prev, ...update }));
  }, []);

  /**
   * Sets the user's state and pre-fills their governor, senators,
   * (at-large) representative, and current federal officials from
   * known-current data. Federal fields are only filled if still blank
   * (any answer the user typed in is preserved). State-specific fields
   * are always refreshed to match the *newly selected* state — otherwise
   * they'd keep showing the previous state's officials.
   */
  const selectState = useCallback((stateName: string) => {
    setGlobalProfile((prev) => {
      const stateChanged = prev.state !== stateName;
      return applyCurrentData({ ...prev, state: stateName }, false, stateChanged);
    });
  }, []);

  /** Re-pulls the latest known officials into every field, overwriting whatever is there now. */
  const refreshCurrentData = useCallback(() => {
    setGlobalProfile((prev) => applyCurrentData(prev, true));
  }, []);

  /** Resolve one personalize-able field to its real, term-annotated answer text, or null if unset. */
  const resolveField = useCallback((field: PersonalizeField): string | null => resolvePersonalizedAnswer(profile, field), [
    profile,
  ]);

  /** True if any filled-in time-bound role's term-end year has already passed. */
  const hasStaleAnswers = useCallback((): boolean => {
    return TIME_BOUND_FIELDS.some((f) => profile[f].trim() && isYearStale(profile[`${f}TermEnd`]));
  }, [profile]);

  /** How many of the personalize-able fields are filled in (for a completeness nudge). */
  const completeness = useCallback((): { done: number; total: number } => {
    const fields: PersonalizeField[] = [
      "capital",
      "governor",
      "senator",
      "representative",
      "president",
      "vicePresident",
      "speakerOfHouse",
      "chiefJustice",
      "presidentParty",
    ];
    const done = fields.filter((f) => resolveField(f) !== null).length;
    return { done, total: fields.length };
  }, [resolveField]);

  return {
    profile,
    setProfile,
    selectState,
    refreshCurrentData,
    resolveField,
    completeness,
    hasStaleAnswers,
    isYearStale,
  };
}
