export type ThemePreference = "light" | "dark";

export const THEME_STORAGE_KEY = "imagine.dashboard.theme";

export function readTheme(): ThemePreference {
  try {
    const v = localStorage.getItem(THEME_STORAGE_KEY);
    if (v === "dark") return "dark";
    return "light";
  } catch {
    return "light";
  }
}

export function writeTheme(theme: ThemePreference) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    /* ignore */
  }
}

/** Apply `dark` class on `<html>` for Tailwind + token overrides. */
export function applyThemeClass(theme: ThemePreference) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}
