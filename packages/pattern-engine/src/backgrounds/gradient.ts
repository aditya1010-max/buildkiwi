import type {
  LinearGradient,
  PatternElement,
  SeededRandom,
} from "../core/types";

export type GradientBackground = {
  definition: LinearGradient;
  element: PatternElement;
};

function createGradientId(seed: string): string {
  return `background-gradient-${seed.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
}

function pickColors(
  colors: readonly string[],
  random: SeededRandom,
): [string, string] {
  if (colors.length === 0) {
    return ["#ffffff", "#ffffff"];
  }

  const start = random.pick(colors);

  if (colors.length === 1) {
    return [start, start];
  }

  let end = random.pick(colors);

  while (end === start) {
    end = random.pick(colors);
  }

  return [start, end];
}

export function generateGradient(
  seed: string,
  colors: readonly string[],
  random: SeededRandom,
  width: number,
  height: number,
): GradientBackground {
  const gradientId = createGradientId(seed);

  const angle = random.int(0, 359);
  const radians = (angle * Math.PI) / 180;

  const x1 = 0.5 - Math.cos(radians) * 0.5;
  const y1 = 0.5 - Math.sin(radians) * 0.5;
  const x2 = 0.5 + Math.cos(radians) * 0.5;
  const y2 = 0.5 + Math.sin(radians) * 0.5;

  const [startColor, endColor] = pickColors(colors, random);

  return {
    definition: {
      type: "linear-gradient",
      id: gradientId,
      x1,
      y1,
      x2,
      y2,
      stops: [
        {
          offset: 0,
          color: startColor,
        },
        {
          offset: 1,
          color: endColor,
        },
      ],
    },

    element: {
      type: "rectangle",
      x: 0,
      y: 0,
      width,
      height,
      fill: `url(#${gradientId})`,
    },
  };
}
