import type {
  Circle,
  PatternElement,
  PatternGenerator,
} from "../../core/types";

import type { Motif, MotifContext } from "../../motifs/types";

import { orbitMotif } from "../../motifs/orbit";
import { ringsMotif } from "../../motifs/rings";
import { gridMotif } from "../../motifs/grid";

const GEOMETRIC_CONFIG = {
  circles: {
    minCount: 5,
    maxCount: 8,

    radius: {
      min: 0.07,
      max: 0.19,
    },

    opacity: {
      min: 0.55,
      max: 0.82,
    },

    sizeVariation: 0.12,
  },

  composition: {
    padding: 0.08,

    minimumSpacing: 0.14,

    overlapChance: 0.35,
  },

  motif: {
    enabled: true,

    chance: 0.85,

    scale: 0.7,

    opacity: 0.62,
  },

  secondaryMotif: {
    enabled: true,

    chance: 0.35,

    scale: 0.28,

    opacity: 0.45,
  },

  color: {
    circleIndexes: [0, 1, 2, 3] as const,

    motifIndexes: [2, 3, 4, 5] as const,
  },
} as const;

type PatternContext = Parameters<PatternGenerator["generate"]>[0];

const geometricMotifs: readonly Motif[] = [orbitMotif, ringsMotif, gridMotif];

function randomBetween(
  context: PatternContext,
  min: number,
  max: number,
): number {
  return min + context.random.next() * (max - min);
}

function randomPosition(
  context: PatternContext,
  min: number,
  max: number,
): number {
  return randomBetween(context, min, max);
}

function pickPaletteColor(
  context: PatternContext,
  indexes: readonly number[],
): string {
  const available = indexes
    .map((index) => context.palette[index])
    .filter((color): color is string => Boolean(color));

  if (available.length === 0) {
    return context.palette[0] ?? "#000000";
  }

  return context.random.pick(available);
}

function createCircle(
  context: PatternContext,
  cx: number,
  cy: number,
  radius: number,
  opacity: number,
): Circle {
  return {
    type: "circle",
    cx,
    cy,
    radius,
    fill: pickPaletteColor(context, GEOMETRIC_CONFIG.color.circleIndexes),
    opacity,
  };
}

function getCirclePositions(
  context: PatternContext,
  count: number,
): Array<{ x: number; y: number }> {
  const positions: Array<{ x: number; y: number }> = [];

  const padding = GEOMETRIC_CONFIG.composition.padding;

  for (let index = 0; index < count; index += 1) {
    let candidate = {
      x: randomPosition(context, padding, 1 - padding) * context.width,

      y: randomPosition(context, padding, 1 - padding) * context.height,
    };

    if (context.random.next() < GEOMETRIC_CONFIG.composition.overlapChance) {
      positions.push(candidate);
      continue;
    }

    for (let attempt = 0; attempt < 8; attempt += 1) {
      const tooClose = positions.some((existing) => {
        const dx = (candidate.x - existing.x) / context.width;

        const dy = (candidate.y - existing.y) / context.height;

        return (
          Math.sqrt(dx * dx + dy * dy) <
          GEOMETRIC_CONFIG.composition.minimumSpacing
        );
      });

      if (!tooClose) {
        break;
      }

      candidate = {
        x: randomPosition(context, padding, 1 - padding) * context.width,

        y: randomPosition(context, padding, 1 - padding) * context.height,
      };
    }

    positions.push(candidate);
  }

  return positions;
}

function createMotifContext(
  context: PatternContext,
  centerX: number,
  centerY: number,
  scale: number,
  opacity: number,
): MotifContext {
  return {
    bounds: {
      x: 0,
      y: 0,
      width: context.width,
      height: context.height,
    },

    center: {
      x: centerX,
      y: centerY,
    },

    random: context.random,

    palette: GEOMETRIC_CONFIG.color.motifIndexes
      .map((index) => context.palette[index])
      .filter((color): color is string => Boolean(color)),

    scale,
    opacity,
  };
}

function generateMotif(
  context: PatternContext,
  motif: Motif,
  centerX: number,
  centerY: number,
  scale: number,
  opacity: number,
): PatternElement[] {
  return motif.generate(
    createMotifContext(context, centerX, centerY, scale, opacity),
  ).elements;
}

export const geometricPattern: PatternGenerator = {
  id: "geometric",

  generate(context) {
    const elements: PatternElement[] = [];

    const size = Math.min(context.width, context.height);

    const budget = context.visualBudget?.maxElements ?? 12;

    const circleCount = Math.min(
      Math.max(
        GEOMETRIC_CONFIG.circles.minCount,
        Math.round(
          randomBetween(
            context,
            GEOMETRIC_CONFIG.circles.minCount,
            GEOMETRIC_CONFIG.circles.maxCount,
          ),
        ),
      ),
      Math.max(1, budget - 3),
    );

    const positions = getCirclePositions(context, circleCount);

    for (const position of positions) {
      const baseRadius =
        size *
        randomBetween(
          context,
          GEOMETRIC_CONFIG.circles.radius.min,
          GEOMETRIC_CONFIG.circles.radius.max,
        );

      const variation =
        1 +
        randomBetween(
          context,
          -GEOMETRIC_CONFIG.circles.sizeVariation,
          GEOMETRIC_CONFIG.circles.sizeVariation,
        );

      const radius = baseRadius * variation;

      const opacity = randomBetween(
        context,
        GEOMETRIC_CONFIG.circles.opacity.min,
        GEOMETRIC_CONFIG.circles.opacity.max,
      );

      elements.push(
        createCircle(context, position.x, position.y, radius, opacity),
      );
    }

    if (
      GEOMETRIC_CONFIG.motif.enabled &&
      geometricMotifs.length > 0 &&
      context.random.next() < GEOMETRIC_CONFIG.motif.chance
    ) {
      const motif = context.random.pick(geometricMotifs);

      const target = context.random.pick(positions);

      elements.push(
        ...generateMotif(
          context,
          motif,
          target.x,
          target.y,
          GEOMETRIC_CONFIG.motif.scale,
          GEOMETRIC_CONFIG.motif.opacity,
        ),
      );
    }

    if (
      GEOMETRIC_CONFIG.secondaryMotif.enabled &&
      geometricMotifs.length > 0 &&
      context.random.next() < GEOMETRIC_CONFIG.secondaryMotif.chance
    ) {
      const motif = context.random.pick(geometricMotifs);

      const target = context.random.pick(positions);

      elements.push(
        ...generateMotif(
          context,
          motif,
          target.x,
          target.y,
          GEOMETRIC_CONFIG.secondaryMotif.scale,
          GEOMETRIC_CONFIG.secondaryMotif.opacity,
        ),
      );
    }

    return {
      elements,
    };
  },
};
