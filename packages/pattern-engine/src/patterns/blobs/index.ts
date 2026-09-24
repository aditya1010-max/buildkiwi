import type {
  Circle,
  PatternGenerator,
  PatternElement,
} from "../../core/types";

type PatternContext = Parameters<PatternGenerator["generate"]>[0];

function getCount(context: PatternContext): number {
  const budget = context.visualBudget?.maxElements;

  if (budget === undefined) {
    return 5;
  }

  return Math.max(1, Math.min(7, budget));
}

function pickColor(context: PatternContext): string {
  return context.random.pick(context.palette) ?? "#ffffff";
}

function createBlob(context: PatternContext, index: number): Circle {
  const size = Math.min(context.width, context.height);

  const radius =
    index === 0
      ? size * (0.22 + context.random.next() * 0.08)
      : size * (0.09 + context.random.next() * 0.12);

  const margin = radius * 0.7;

  let cx: number;
  let cy: number;

  if (context.composition) {
    const { region } = context.composition;

    cx = region.x + region.width * (0.15 + context.random.next() * 0.7);

    cy = region.y + region.height * (0.15 + context.random.next() * 0.7);
  } else {
    cx = -margin + context.random.next() * (context.width + margin * 2);

    cy = -margin + context.random.next() * (context.height + margin * 2);
  }

  // Keep the first blob as the main visual anchor.
  if (index === 0) {
    cx = context.width * 0.35 + context.random.next() * context.width * 0.3;

    cy = context.height * 0.35 + context.random.next() * context.height * 0.3;
  }

  const opacity = index === 0 ? 0.85 : 0.5 + context.random.next() * 0.25;

  const scale = 0.85 + context.random.next() * 0.3;

  return {
    type: "circle",
    cx,
    cy,
    radius: radius * scale,
    fill: pickColor(context),
    opacity,
  };
}

function createBlobLayer(context: PatternContext): PatternElement[] {
  const count = getCount(context);
  const elements: Circle[] = [];

  for (let index = 0; index < count; index += 1) {
    elements.push(createBlob(context, index));
  }

  return elements;
}

export const blobsPattern: PatternGenerator = {
  id: "blobs",

  generate(context) {
    return {
      elements: createBlobLayer(context),
    };
  },
};
