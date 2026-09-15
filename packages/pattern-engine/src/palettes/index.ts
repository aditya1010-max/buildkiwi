import { createSeededRandom } from "../core/random";

import type {
  ColorSystem,
  SeededRandom,
} from "../core/types";

import {
  analogousHue,
  complementaryHue,
  selectColorHarmony,
  splitComplementaryHues,
  type ColorHarmony,
} from "./harmony";

import { validateColorSystem } from "./validation";

const majorColors = [
  "#2564eb",
  "#16a34a",
  "#dc2626",
  "#eab208",
  "#313131",
  "#a9a965",
] as const;

type PaletteSeed = {
  hue: number;
  surface: string;
};

function createPaletteSeed(
  seed: string,
): PaletteSeed {
  const random = createSeededRandom(seed);

  return {
    hue: random.int(0, 359),
    surface: random.pick(majorColors),
  };
}

function generateBackground(
  harmony: ColorHarmony,
  hue: number,
): string {
  if (harmony === "neutral-accent") {
    return "hsl(220, 15%, 8%)";
  }

  return `hsl(${hue}, 20%, 8%)`;
}

function generateSurface(
  surface: string,
): string {
  return surface;
}

function generatePrimary(
  hue: number,
): string {
  return `hsla(${hue}, 65%, 55%, 0.65)`;
}

function generateSecondary(
  hue: number,
  harmony: ColorHarmony,
): string {
  switch (harmony) {
    case "analogous":
      return `hsla(${analogousHue(hue, 30)}, 60%, 48%, 0.65)`;

    case "complementary":
      return `hsla(${complementaryHue(hue)}, 60%, 48%, 0.65)`;

    case "split-complementary": {
      const [secondaryHue] =
        splitComplementaryHues(hue);

      return `hsla(${secondaryHue}, 60%, 48%, 0.65)`;
    }

    case "monochromatic":
      return `hsla(${hue}, 50%, 40%, 0.65)`;

    case "neutral-accent":
      return `hsl(${hue}, 10%, 45%)`;
  }
}

function generateAccent(
  hue: number,
  harmony: ColorHarmony,
): string {
  switch (harmony) {
    case "analogous":
      return `hsla(${analogousHue(hue, 60)}, 70%, 62%, 0.75)`;

    case "complementary":
      return `hsla(${complementaryHue(hue)}, 70%, 65%, 0.75)`;

    case "split-complementary": {
      const [, accentHue] =
        splitComplementaryHues(hue);

      return `hsla(${accentHue}, 70%, 65%, 0.75)`;
    }

    case "monochromatic":
      return `hsla(${hue}, 75%, 70%, 0.75)`;

    case "neutral-accent":
      return `hsla(${complementaryHue(hue)}, 75%, 65%, 0.8)`;
  }
}

function generateMuted(
  hue: number,
  harmony: ColorHarmony,
): string {
  if (harmony === "neutral-accent") {
    return "hsla(220, 10%, 65%, 0.4)";
  }

  return `hsla(${hue}, 15%, 65%, 0.4)`;
}

function generateForeground(
  harmony: ColorHarmony,
): string {
  if (harmony === "neutral-accent") {
    return "#f5f5f5";
  }

  return "#ffffff";
}

export function generatePalette(
  seed: string,
): ColorSystem {
  const random: SeededRandom =
    createSeededRandom(`${seed}:palette`);

  const paletteSeed = createPaletteSeed(seed);

  const harmony = selectColorHarmony(random);

  const colors: ColorSystem = {
    background: generateBackground(
      harmony,
      paletteSeed.hue,
    ),

    surface: generateSurface(
      paletteSeed.surface,
    ),

    primary: generatePrimary(
      paletteSeed.hue,
    ),

    secondary: generateSecondary(
      paletteSeed.hue,
      harmony,
    ),

    accent: generateAccent(
      paletteSeed.hue,
      harmony,
    ),

    muted: generateMuted(
      paletteSeed.hue,
      harmony,
    ),

    foreground: generateForeground(
      harmony,
    ),
  };

  validateColorSystem(colors);

  return colors;
}