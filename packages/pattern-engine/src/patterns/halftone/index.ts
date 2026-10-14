import type {
  Circle,
  PatternGenerator,
  PatternElement,
} from "../../core/types";

type DotRole = "dominant" | "supporting" | "accent";

type HalftoneMode =
  "radial" | "concentric" | "wave" | "diagonal" | "spiral" | "diamond";

type GenerationContext = Parameters<PatternGenerator["generate"]>[0];

interface Point {
  x: number;
  y: number;
  nx: number;
  ny: number;
}

const HALFTONE_MODES: readonly HalftoneMode[] = [
  "radial",
  "concentric",
  "wave",
  "diagonal",
  "spiral",
  "diamond",
];

function getColor(context: GenerationContext, role: DotRole): string {
  if (role === "dominant") {
    return (
      context.colorSystem?.primary ?? context.palette[2] ?? context.palette[0]
    );
  }

  if (role === "accent") {
    return (
      context.colorSystem?.accent ?? context.palette[4] ?? context.palette[0]
    );
  }

  return (
    context.colorSystem?.secondary ??
    context.colorSystem?.muted ??
    context.palette[1] ??
    context.palette[0]
  );
}

function getGridSize(context: GenerationContext): {
  rows: number;
  columns: number;
} {
  const density = Math.max(0.5, context.visualBudget?.density ?? 1);

  const aspectRatio = context.width / Math.max(context.height, 1);

  // Guarantee at least 13 rows and 13 columns.
  const baseSide = Math.max(13, Math.ceil(13 * density));

  const columns = Math.max(
    13,
    Math.min(128, Math.round(baseSide * Math.sqrt(aspectRatio))),
  );

  const rows = Math.max(
    13,
    Math.min(128, Math.round(baseSide / Math.sqrt(aspectRatio))),
  );

  return { rows, columns };
}

function smoothstep(value: number): number {
  const t = Math.max(0, Math.min(1, value));
  return t * t * (3 - 2 * t);
}

function getIntensity(
  mode: HalftoneMode,
  point: Point,
  phase: number,
  angle: number,
): number {
  const { nx, ny } = point;

  const x = nx * Math.cos(angle) + ny * Math.sin(angle);
  const y = -nx * Math.sin(angle) + ny * Math.cos(angle);

  const radius = Math.sqrt(x * x + y * y);
  const theta = Math.atan2(y, x);

  switch (mode) {
    case "radial": {
      // Large central dots fading smoothly toward the edges.
      return 0.08 + 0.92 * smoothstep(1 - radius / Math.SQRT2);
    }

    case "concentric": {
      // Repeating circular rings.
      const rings = 0.5 + 0.5 * Math.cos(radius * 34 + phase);
      const envelope = 0.35 + 0.65 * smoothstep(1 - radius / Math.SQRT2);

      return 0.08 + 0.92 * rings * envelope;
    }

    case "wave": {
      // Flowing waves with a secondary wave for organic variation.
      const wave = Math.sin(x * 18 + Math.sin(y * 7 + phase) * 2.5 + phase);

      return 0.08 + 0.92 * (0.5 + 0.5 * wave);
    }

    case "diagonal": {
      // Diagonal bands of dots.
      const stripes = Math.cos((x + y * 0.65) * 17 + phase);

      return 0.08 + 0.92 * (0.5 + 0.5 * stripes);
    }

    case "spiral": {
      // Rotating spiral arms with repeating dot sizes.
      const spiral = Math.cos(theta * 3 + radius * 25 + phase);

      return 0.08 + 0.92 * (0.5 + 0.5 * spiral);
    }

    case "diamond": {
      // A diamond-shaped intensity field.
      const distance = (Math.abs(x) + Math.abs(y)) / 2;

      return 0.08 + 0.92 * smoothstep(1 - distance);
    }
  }
}

function getRole(intensity: number): DotRole {
  if (intensity > 0.72) return "dominant";
  if (intensity > 0.38) return "supporting";
  return "accent";
}

function getOpacity(role: DotRole): number {
  switch (role) {
    case "dominant":
      return 0.85;
    case "supporting":
      return 0.62;
    case "accent":
      return 0.42;
  }
}

function createHalftone(context: GenerationContext): PatternElement[] {
  const elements: Circle[] = [];

  const { rows, columns } = getGridSize(context);

  const spacingX = context.width / columns;
  const spacingY = context.height / rows;

  const mode =
    HALFTONE_MODES[Math.floor(context.random.next() * HALFTONE_MODES.length)];

  const angle = context.random.next() * Math.PI * 2;
  const phase = context.random.next() * Math.PI * 2;

  const baseSize = Math.min(spacingX, spacingY) * 0.38;

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const cx = (column + 0.5) * spacingX;
      const cy = (row + 0.5) * spacingY;

      const point: Point = {
        x: cx,
        y: cy,
        nx:
          ((cx / context.width) * 2 - 1) *
          (context.width / Math.min(context.width, context.height)),
        ny:
          ((cy / context.height) * 2 - 1) *
          (context.height / Math.min(context.width, context.height)),
      };

      const intensity = getIntensity(mode, point, phase, angle);
      const role = getRole(intensity);

      const radiusVariation = 0.88 + context.random.next() * 0.24;
      const radius = baseSize * (0.2 + intensity * 0.8) * radiusVariation;

      elements.push({
        type: "circle",
        cx,
        cy,
        radius,
        fill: getColor(context, role),
        opacity: getOpacity(role),
      });
    }
  }

  return elements;
}

export const halftonePattern: PatternGenerator = {
  id: "halftone",

  generate(context) {
    return {
      elements: createHalftone(context),
    };
  },
};
