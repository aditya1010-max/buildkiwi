import { useEffect, useMemo, useState, type ReactNode } from "react";

import {
  getStoredLanguage,
  resolveLanguage,
  saveLanguage,
  type Language,
} from "../utils/language";

import { translations, type TranslationKey } from "../locales";

import { LanguageContext } from "./LanguageContext";

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>(getStoredLanguage);

  useEffect(() => {
    saveLanguage(language);
  }, [language]);

  const resolvedLanguage = resolveLanguage(language);

  const value = useMemo(
    () => ({
      language,
      setLanguage,

      t: (key: TranslationKey) => translations[resolvedLanguage][key],
    }),
    [language, resolvedLanguage],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}
