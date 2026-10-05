import type { PatternTheme } from "../types";

export const blobsTheme: PatternTheme = {
  colorSystem: {
    // Base UI / background
    background: "#fffbeb", // warm soft cream

    // Organic blob shapes
    primary: "#f59e0b", // warm amber
    secondary: "#ec4899", // vibrant pink
    accent: "#8b5cf6", // soft purple

    // Supporting shapes
    muted: "#fde68a", // soft yellow

    // Text / foreground
    foreground: "#78350f",
    surface: "",
  },

  background: {
    type: "gradient",

    // Warm, organic, and playful tones.
    colors: [
      "#fef3c7",
      "#fde68a",
      "#fbcfe8",
      "#f472b6",
      "#c084fc",
      "#a78bfa",
      "#818cf8",
    ],

    opacity: 0.85,
  },

  visualBudget: {
    maxElements: 6,
    density: 0.5,
    contrast: 0.9,
    complexity: 0.7,
    accentUsage: 0.4,
  },
};
