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
import { resolvePatternTheme } from "../themes/resolve";

function applyElementBudget(
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

export function generatePattern(config: PatternConfig): GeneratedImage {
  const random = createSeededRandom(config.seed);

  const theme = resolvePatternTheme(config.pattern);

  const colors =
    config.colorSystem ?? theme.colorSystem ?? generatePalette(config.seed);

  const palette = [
    colors.background,
    colors.surface,
    colors.primary,
    colors.secondary,
    colors.accent,
    colors.muted,
  ] as const;

  const background = theme.background;

  const gradient =
    background?.type === "gradient"
      ? generateGradient(
          config.seed,
          background.colors ?? [colors.background],
          random,
          config.width,
          config.height,
        )
      : null;

  const pattern = getPattern(config.pattern);

  const output = pattern.generate({
    width: config.width,
    height: config.height,

    palette,

    random,

    composition: config.composition,

    visualStyle: config.visualStyle,

    visualBudget: config.visualBudget ?? theme.visualBudget,

    colorSystem: colors,
  });

  const elements = config.visualBudget
    ? applyElementBudget(output.elements, config.visualBudget.maxElements)
    : output.elements;

  const ring: Circle[] = config.ring
    ? [
        {
          type: "circle",
          cx: config.width / 2,
          cy: config.height / 2,
          radius:
            Math.min(config.width, config.height) / 2 - config.ring.width / 2,
          fill: "none",
          stroke: config.ring.color,
          strokeWidth: config.ring.width,
        },
      ]
    : [];

  return serializeSvg(
    {
      definitions: [
        ...(gradient ? [gradient.definition] : []),
        ...(output.definitions ?? []),
      ],

      elements: [...(gradient ? [gradient.element] : []), ...elements, ...ring],
    },

    {
      width: config.width,
      height: config.height,
      background: config.background ?? colors.background,
    },
  );
}
