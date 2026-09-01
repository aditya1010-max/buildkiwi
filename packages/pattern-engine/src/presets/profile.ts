import type {
  PatternConfig,
  PatternId,
} from "../core/types";

export const profilePreset = (
  seed: string,
  pattern: PatternId,
): PatternConfig => ({
  seed,
  pattern,
  width: 512,
  height: 512,
  borderRadius: 999,
  palette: [],
  // ring: {
  //   color: "#b00303",
  //   width: 100,
  // },
});