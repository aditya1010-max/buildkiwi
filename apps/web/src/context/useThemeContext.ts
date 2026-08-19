import { useContext } from "react";

import { ThemeContext, type ThemeContextValue } from "./ThemeContext";

export function useThemeContext(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useThemeContext must be used inside ThemeProvider");
  }

  return context;
}