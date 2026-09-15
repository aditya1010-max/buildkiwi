import type {
  Circle,
  PatternElement,
  PatternGenerator,
  Rectangle,
} from "../../core/types";

type ShapeRole = "dominant" | "supporting" | "accent";

function getColor(
  context: Parameters<PatternGenerator["generate"]>[0],
  role: ShapeRole,
): string {
  const fallback = context.palette[0] ?? "#000000";

  if (role === "dominant") {
    return context.colorSystem?.primary ?? fallback;
  }

  if (role === "supporting") {
    return (
      context.colorSystem?.secondary ??
      context.colorSystem?.surface ??
      context.palette[1] ??
      fallback
    );
  }

  return (
    context.colorSystem?.accent ??
    context.palette[2] ??
    context.colorSystem?.secondary ??
    fallback
  );
}

function createCircle(
  context: Parameters<PatternGenerator["generate"]>[0],
  role: ShapeRole,
  cx: number,
  cy: number,
  radius: number,
): Circle {
  return {
    type: "circle",
    cx,
    cy,
    radius,
    fill: getColor(context, role),
    opacity:
      role === "dominant"
        ? 0.9
        : role === "supporting"
          ? 0.65
          : 0.8,
  };
}

function createRectangle(
  context: Parameters<PatternGenerator["generate"]>[0],
  role: ShapeRole,
  x: number,
  y: number,
  size: number,
): Rectangle {
  return {
    type: "rectangle",
    x,
    y,
    width: size,
    height: size,
    fill: getColor(context, role),
    opacity:
      role === "dominant"
        ? 0.9
        : role === "supporting"
          ? 0.65
          : 0.8,
  };
}

export const geometricPattern: PatternGenerator = {
  id: "geometric",

  generate(context) {
    const elements: PatternElement[] = [];

    const size = Math.min(context.width, context.height);

    /*
     * Geometric intentionally stays sparse.
     *
     * Maximum:
     * - 1 dominant
     * - 1 supporting
     * - 1 accent
     *
     * VisualBudget can reduce this further.
     */
    const budget = Math.max(
      0,
      Math.min(context.visualBudget?.maxElements ?? 3, 3),
    );

    if (budget === 0) {
      return { elements };
    }

    /*
     * Keep shapes comfortably inside the artwork.
     * Small controlled variation still comes from the seed.
     */
    const dominantRadius =
      size * (0.19 + context.random.next() * 0.05);

    const dominantX =
      context.width * (0.45 + context.random.next() * 0.1);

    const dominantY =
      context.height * (0.42 + context.random.next() * 0.16);

    /*
     * Dominant shape
     */
    if (context.random.next() > 0.35) {
      elements.push(
        createCircle(
          context,
          "dominant",
          dominantX,
          dominantY,
          dominantRadius,
        ),
      );
    } else {
      const dominantSize = dominantRadius * 1.8;

      elements.push(
        createRectangle(
          context,
          "dominant",
          dominantX - dominantSize / 2,
          dominantY - dominantSize / 2,
          dominantSize,
        ),
      );
    }

    if (budget === 1) {
      return { elements };
    }

    /*
     * Supporting shape.
     *
     * Place it away from the dominant shape so the composition
     * has visual balance instead of looking like a random pile.
     */
    const supportingSize =
      size * (0.09 + context.random.next() * 0.05);

    const supportingSide = context.random.next() > 0.5;

    const supportingX = supportingSide
      ? context.width * (0.18 + context.random.next() * 0.12)
      : context.width * (0.72 + context.random.next() * 0.1);

    const supportingY =
      context.height * (0.2 + context.random.next() * 0.6);

    if (context.random.next() > 0.5) {
      elements.push(
        createCircle(
          context,
          "supporting",
          supportingX,
          supportingY,
          supportingSize / 2,
        ),
      );
    } else {
      elements.push(
        createRectangle(
          context,
          "supporting",
          supportingX - supportingSize / 2,
          supportingY - supportingSize / 2,
          supportingSize,
        ),
      );
    }

    if (budget === 2) {
      return { elements };
    }

    /*
     * Accent shape.
     *
     * Small enough to remain an accent rather than becoming
     * another focal element.
     */
    const accentSize =
      size * (0.035 + context.random.next() * 0.025);

    const accentX =
      context.random.next() > 0.5
        ? context.width * (0.1 + context.random.next() * 0.15)
        : context.width * (0.75 + context.random.next() * 0.15);

    const accentY =
      context.random.next() > 0.5
        ? context.height * (0.12 + context.random.next() * 0.18)
        : context.height * (0.72 + context.random.next() * 0.16);

    elements.push(
      createRectangle(
        context,
        "accent",
        accentX - accentSize / 2,
        accentY - accentSize / 2,
        accentSize,
      ),
    );

    return {
      elements,
    };
  },
};