import type {
  Circle,
  GeneratedImage,
  PatternConfig,
  PatternElement,
} from "./types";

import { createSeededRandom } from "./random";
import { getPattern } from "./registry";
import { serializeSvg } from "../svg/serialize";
import { generatePalette } from "../palettes";
import { generateGradient } from "../backgrounds/gradient";

function applyVisualBudget(
  elements: PatternElement[],
  maxElements: number,
): PatternElement[] {
  if (maxElements <= 0) {
    return [];
  }

  if (elements.length <= maxElements) {
    return elements;
  }

  return elements.slice(0, maxElements);
}

export function generatePattern(
  config: PatternConfig,
): GeneratedImage {
  const random = createSeededRandom(config.seed);

  const colors = config.colorSystem ?? generatePalette(config.seed);

  const gradient = generateGradient(
    config.seed,
    colors,
    random,
    config.width,
    config.height,
  );

  const pattern = getPattern(config.pattern);

  const output = pattern.generate({
    width: config.width,
    height: config.height,
    borderRadius: config.borderRadius,

    palette: [
      colors.background,
      colors.surface,
      colors.primary,
      colors.secondary,
      colors.accent,
      colors.muted,
    ],

    random,

    composition: config.composition,

    visualStyle: config.visualStyle,

    visualBudget: config.visualBudget,

    colorSystem: colors,
  });

  const elements = config.visualBudget
    ? applyVisualBudget(
        output.elements,
        config.visualBudget.maxElements,
      )
    : output.elements;

  const ring: Circle[] = config.ring
    ? [
        {
          type: "circle",
          cx: config.width / 2,
          cy: config.height / 2,
          radius:
            Math.min(config.width, config.height) / 2 -
            config.ring.width / 2,
          fill: "none",
          stroke: config.ring.color,
          strokeWidth: config.ring.width,
        },
      ]
    : [];

  return serializeSvg(
    {
      definitions: [
        gradient.definition,
        ...(output.definitions ?? []),
      ],

      elements: [
        gradient.element,
        ...elements,
        ...ring,
      ],
    },

    {
      width: config.width,
      height: config.height,
      borderRadius: config.borderRadius,
      background: config.background ?? colors.background,
    },
  );
}