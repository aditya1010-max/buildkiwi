import type { PatternConfig } from "../core/types";

export const profilePreset = (
  seed: string,
): PatternConfig => ({
  seed,
  pattern: "geometric",
  width: 512,
  height: 512,
  borderRadius: 999,
  palette: [],
  ring: {
    color: "#b00303",
    width: 100,
  },
});