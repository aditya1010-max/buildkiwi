import { createContext } from "react";

import type { Language } from "../utils/language";
import type { TranslationKey } from "../locales";

export interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey) => string;
}

export const LanguageContext = createContext<LanguageContextValue | null>(null);
