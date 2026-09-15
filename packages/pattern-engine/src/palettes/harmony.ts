import type { SeededRandom } from "../core/types";

export type ColorHarmony =
  | "analogous"
  | "complementary"
  | "split-complementary"
  | "monochromatic"
  | "neutral-accent";

const HARMONIES: readonly ColorHarmony[] = [
  "analogous",
  "complementary",
  "split-complementary",
  "monochromatic",
  "neutral-accent",
];

export function selectColorHarmony(
  random: SeededRandom,
): ColorHarmony {
  return random.pick(HARMONIES);
}

export function normalizeHue(hue: number): number {
  return ((hue % 360) + 360) % 360;
}

export function analogousHue(
  baseHue: number,
  offset: number,
): number {
  return normalizeHue(baseHue + offset);
}

export function complementaryHue(
  baseHue: number,
): number {
  return normalizeHue(baseHue + 180);
}

export function splitComplementaryHues(
  baseHue: number,
): [number, number] {
  return [
    normalizeHue(baseHue + 150),
    normalizeHue(baseHue + 210),
  ];
}