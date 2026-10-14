import type { PatternTheme } from "../types";

export const halftoneTheme: PatternTheme = {
  colorSystem: {
    // Base UI / background
    background: "#FFF8E8",
    surface: "#FFFFFF",

    // Halftone dots
    primary: "#24315C",
    secondary: "#4C69F6",
    accent: "#EE5454",

    // Supporting tone
    muted: "#4C94F6",

    // Text / foreground
    foreground: "#25263A",
  },

  background: {
    type: "gradient",
    colors: [
      "#FFF8E8",
      "#FFF0C2",
      "#FCE3D8",
      "#DCE8FF",
      "#E0E5FF",
      "#FFF0B0",
      "#FFF8E8",
    ],
    opacity: 0.95,
  },

  visualBudget: {
    maxElements: 40,
    density: 0.9,
    contrast: 1.2,
    complexity: 0.55,
    accentUsage: 0.15,
  },
};
