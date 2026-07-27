export type Theme = "light" | "dark" | "system";

export const THEME_STORAGE_KEY = "theme";

export function isTheme(value: string | null): value is Theme {
  return value === "light" || value === "dark" || value === "system";
}

export function getStoredTheme(): Theme {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);

  return isTheme(stored) ? stored : "system";
}

export function saveTheme(theme: Theme) {
  localStorage.setItem(THEME_STORAGE_KEY, theme);
}

export function resolveTheme(theme: Theme): "light" | "dark" {
  if (theme === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  return theme;
}

export function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", resolveTheme(theme));
}
