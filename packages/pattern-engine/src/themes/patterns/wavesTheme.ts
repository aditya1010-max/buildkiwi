import type { PatternTheme } from "../types";

export const wavesTheme: PatternTheme = {
  colorSystem: {
    // Base UI / background
    background: "#f0f8ff", // soft alice blue

    // Wave layers & strokes
    primary: "#3b82f6", // vibrant ocean blue
    secondary: "#06b6d4", // cyan
    accent: "#6366f1", // indigo highlight

    // Supporting elements
    muted: "#93c5fd", // light blue accent

    // Text / foreground
    foreground: "#1e3a8a",
    surface: "",
  },

  background: {
    type: "gradient",

    // Fluid, oceanic, and tranquil tones.
    colors: [
      "#e0f2fe",
      "#bae6fd",
      "#7dd3fc",
      "#38bdf8",
      "#0284c7",
      "#075985",
      "#020617",
    ],

    opacity: 0.9,
  },

  visualBudget: {
    maxElements: 8,
    density: 0.6,
    contrast: 0.8,
    complexity: 0.5,
    accentUsage: 0.3,
  },
};
