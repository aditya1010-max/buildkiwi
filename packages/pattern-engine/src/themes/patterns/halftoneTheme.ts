import type { PatternTheme } from "../types";

export const halftoneTheme: PatternTheme = {
  colorSystem: {
    // Base UI / background
    background: "#f8fafc", // crisp off-white

    // Dot grid points
    primary: "#0f172a", // dark high-contrast dots
    secondary: "#0d9488", // teal accent dots
    accent: "#f97316", // vibrant orange highlight dot

    // Supporting tone
    muted: "#cbd5e1", // subtle background dots

    // Text / foreground
    foreground: "#334155",
    surface: "",
  },

  background: {
    type: "gradient",

    // Modern, clean, technical gradient tones.
    colors: ["#f1f5f9", "#e2e8f0", "#cbd5e1", "#94a3b8", "#64748b"],

    opacity: 0.8,
  },

  visualBudget: {
    maxElements: 40,
    density: 0.9,
    contrast: 1.0,
    complexity: 0.4,
    accentUsage: 0.1,
  },
};
