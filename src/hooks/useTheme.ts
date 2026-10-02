import { useCallback, useEffect, useState } from "react";

export type ThemePreference = "system" | "light" | "dark";

const STORAGE_KEY = "citizenship-exam-theme-v1";
const ORDER: ThemePreference[] = ["system", "light", "dark"];

function readStored(): ThemePreference {
  if (typeof window === "undefined") return "system";
  const raw = window.localStorage.getItem(STORAGE_KEY);
  return raw === "light" || raw === "dark" || raw === "system" ? raw : "system";
}

function applyTheme(theme: ThemePreference) {
  const root = document.documentElement;
  if (theme === "system") {
    root.removeAttribute("data-theme");
  } else {
    root.setAttribute("data-theme", theme);
  }
}

/** Light/dark/system theme preference, persisted in localStorage and applied via a data-theme attribute. */
export function useTheme() {
  const [theme, setThemeState] = useState<ThemePreference>(readStored);

  useEffect(() => {
    applyTheme(theme);
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const setTheme = useCallback((next: ThemePreference) => setThemeState(next), []);

  const cycleTheme = useCallback(() => {
    setThemeState((current) => ORDER[(ORDER.indexOf(current) + 1) % ORDER.length]);
  }, []);

  return { theme, setTheme, cycleTheme };
}
