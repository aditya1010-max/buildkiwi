import type { PatternTheme } from "../types";

export const constellationTheme: PatternTheme = {
  colorSystem: {
    // Base UI / background
    background: "#0f172a", // deep dark slate (night sky)
    surface: "#1e293b", // dark surface

    // Stars and nodes
    primary: "#38bdf8", // bright sky blue star
    secondary: "#818cf8", // indigo connection
    accent: "#f43f5e", // red supergiant accent

    // Supporting connections
    muted: "#475569", // faint grid/line color

    // Text / foreground
    foreground: "#f8fafc", // bright star white
  },

  background: {
    type: "gradient",

    // Deep cosmic dark space gradient tones.
    colors: ["#0f172a", "#1e1b4b", "#311042", "#1e293b", "#0f172a"],

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
