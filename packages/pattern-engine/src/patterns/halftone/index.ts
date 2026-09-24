import type {
  Circle,
  PatternGenerator,
  PatternElement,
} from "../../core/types";

type DotRole = "dominant" | "supporting" | "accent";

function getColor(
  context: Parameters<PatternGenerator["generate"]>[0],
  role: DotRole,
): string {
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
    context.colorSystem?.muted ??
    context.colorSystem?.secondary ??
    context.palette[1] ??
    context.palette[0]
  );
}

function getGridSize(context: Parameters<PatternGenerator["generate"]>[0]): {
  rows: number;
  columns: number;
} {
  const budget = context.visualBudget?.maxElements;

  if (budget === undefined) {
    return {
      rows: 12,
      columns: 12,
    };
  }

  const side = Math.max(2, Math.floor(Math.sqrt(budget)));

  return {
    rows: side,
    columns: side,
  };
}

function createHalftone(
  context: Parameters<PatternGenerator["generate"]>[0],
): PatternElement[] {
  const elements: Circle[] = [];

  const { rows, columns } = getGridSize(context);

  const spacingX = context.width / columns;
  const spacingY = context.height / rows;

  const centerX = (columns - 1) / 2;
  const centerY = (rows - 1) / 2;

  const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const distanceX = column - centerX;
      const distanceY = row - centerY;

      const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

      const falloff = Math.max(0, 1 - distance / maxDistance);

      const intensity = 0.18 + falloff * 0.82;

      if (intensity < 0.3 && context.random.next() < 0.35) {
        continue;
      }

      const role: DotRole =
        intensity > 0.75
          ? "dominant"
          : intensity > 0.45
            ? "supporting"
            : "accent";

      const baseSize = Math.min(spacingX, spacingY) * 0.42;

      const radius = baseSize * intensity * (0.8 + context.random.next() * 0.2);

      const cx = column * spacingX + spacingX / 2;

      const cy = row * spacingY + spacingY / 2;

      elements.push({
        type: "circle",
        cx,
        cy,
        radius,
        fill: getColor(context, role),
        opacity: role === "dominant" ? 0.75 : role === "supporting" ? 0.5 : 0.3,
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
