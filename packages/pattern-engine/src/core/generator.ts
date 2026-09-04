import type { Circle, GeneratedImage, PatternConfig } from "./types";
import { createSeededRandom } from "./random";
import { getPattern } from "./registry";
import { serializeSvg } from "../svg/serialize";
import { generatePalette } from "../palettes";
import { generateGradient } from "../backgrounds/gradient";

export function generatePattern(config: PatternConfig): GeneratedImage {
  const random = createSeededRandom(config.seed);

  const palette = generatePalette(config.seed);

  const gradient = generateGradient(
    palette,
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
      palette.major,
      palette.primary,
      palette.secondary,
      palette.accent,
    ],
    random,
  });

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
      definitions: [gradient.definition, ...(output.definitions ?? [])],
      elements: [gradient.element, ...output.elements, ...ring],
    },
    {
      width: config.width,
      height: config.height,
      borderRadius: config.borderRadius,
      background: config.background,
    },
  );
}
