import type { PatternConfig } from "../core/types";

export const coverPreset = (seed: string): PatternConfig => ({
  seed,
  pattern: "geometric",
  width: 1200,
  height: 630,
  borderRadius: 16,
  palette: [],
});
