import type { PatternTheme } from "../types";

export const constellationTheme: PatternTheme = {
  colorSystem: {
    // Base UI / background
    background: "#080B18",
    surface: "#141A30",

    // Stars and nodes
    primary: "#5CE1E6",
    secondary: "#A78BFA",
    accent: "#FFD166",

    // Supporting connections
    muted: "#39445F",

    // Text / foreground
    foreground: "#F1F5FF",
  },

  background: {
    type: "gradient",
    colors: ["#050816", "#101A3A", "#28205A", "#42205B", "#164454", "#080B18"],
    opacity: 0.95,
  },

  visualBudget: {
    maxElements: 25,
    density: 0.8,
    contrast: 1.2,
    complexity: 0.8,
    accentUsage: 0.15,
  },
};
