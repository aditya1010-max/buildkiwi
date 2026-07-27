export type Language = "system" | "en" | "hi";

export const LANGUAGE_STORAGE_KEY = "language";

export function isLanguage(value: string | null): value is Language {
  return value === "system" || value === "en" || value === "hi";
}

export function getStoredLanguage(): Language {
  const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);

  return isLanguage(stored) ? stored : "system";
}

export function saveLanguage(language: Language) {
  localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
}

export function resolveLanguage(language: Language): "en" | "hi" {
  if (language !== "system") {
    return language;
  }

  const browserLanguage = navigator.language.toLowerCase();

  return browserLanguage.startsWith("hi") ? "hi" : "en";
}
