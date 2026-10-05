import type { PatternId } from "../core/types";

import type { PatternTheme } from "./types";

import { geometricTheme } from "./patterns/geometricTheme";
import { wavesTheme } from "./patterns/wavesTheme";
import { halftoneTheme } from "./patterns/halftoneTheme";
import { constellationTheme } from "./patterns/constellationTheme";
import { blobsTheme } from "./patterns/blobTheme";

const PATTERN_THEMES: Partial<Record<PatternId, PatternTheme>> = {
  geometric: geometricTheme,
  waves: wavesTheme,
  blobs: blobsTheme,
  constellation: constellationTheme,
  halftone: halftoneTheme,
};

const DEFAULT_THEME: PatternTheme = {
  colorSystem: {
    background: "#cc7777",
    surface: "#82d1d1",
    primary: "#748ec3",
    secondary: "#69b674",
    accent: "#a78bfa",
    muted: "#b7b281",
    foreground: "#bd7fcc",
  },
  background: {
    type: "gradient",
    colors: [
      "#b66f6f",
      "#78b26e",
      "#7187b4",
      "#aea96d", // Original 4
      "#b27cb0",
      "#6eb1b2",
      "#c18a66",
      "#8a7cb2",
      "#8fa36a",
      "#c47791",
      "#68b993",
      "#b99c68",
      "#7a94b4",
      "#ae6d89",
      "#6db681",
      "#a982b6",
      "#b7b06f",
      "#6f8cb7",
      "#c27d73",
      "#74b39b",
    ],
    opacity: 0.85,
  },
};

export function resolvePatternTheme(pattern: PatternId): PatternTheme {
  return PATTERN_THEMES[pattern] ?? DEFAULT_THEME;
}
