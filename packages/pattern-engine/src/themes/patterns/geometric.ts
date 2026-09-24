import type { PatternTheme } from "../types";

export const geometricTheme: PatternTheme = {
  colorSystem: {
    // Base UI / background
    background: "#fff4f8", // soft blush
    surface: "#eefaf4", // fresh mint

    // Geometric shapes
    primary: "#7c6fe8", // soft periwinkle
    secondary: "#5fc7a3", // fresh spring green
    accent: "#67b9e8", // soft sky blue

    // Supporting shapes
    muted: "#f0a6c8", // muted bubblegum

    // Text / foreground
    foreground: "#465568", // soft slate
  },

  background: {
    type: "gradient",

    // Soft, light, fresh colors.
    // No deep purple, saturated green, or dark blue.
    colors: [
      "#d5cf87",
      "#d5a787",
      "#d58787",
      "#91d587",
      "#87d5b3",
      "#87a6d5",
      "#8787d5",
    ],

    opacity: 0.85,
  },

  visualBudget: {
    maxElements: 12,
    density: 0.7,
    contrast: 1,
    complexity: 0.6,
    accentUsage: 0.2,
  },
};
