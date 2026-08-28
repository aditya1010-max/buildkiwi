import { createSeededRandom } from "../core/random";

export type ColorPalette = {
  major: string;
  primary: string;
  secondary: string;
  accent: string;
};

const majorColors = [
  "#2564eb90",
  "#16a34aa8",
  "#dc2626a8",
  "#eab208a8",
  "#313131b3",
  "#a9a965b5",
] as const;

export function generatePalette(
  seed: string,
): ColorPalette {
  const random = createSeededRandom(seed);

  const major = random.pick(majorColors);

  const baseHue = random.int(0, 359);

  const primary =
    `hsla(${baseHue}, 65%, 55%, 0.65)`;

  const secondaryHue =
    (baseHue + 35) % 360;

  const secondary =
    `hsla(${secondaryHue}, 60%, 45%, 0.65)`;

  const accentHue =
    (baseHue + 180) % 360;

  const accent =
    `hsla(${accentHue}, 70%, 65%, 0.75)`;

  return {
    major,
    primary,
    secondary,
    accent,
  };
}