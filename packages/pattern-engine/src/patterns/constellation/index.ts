import type {
  Circle,
  Line,
  PatternGenerator,
  PatternElement,
} from "../../core/types";

type PatternContext = Parameters<PatternGenerator["generate"]>[0];

function getNodeCount(context: PatternContext): number {
  const budget = context.visualBudget?.maxElements;

  if (budget === undefined) {
    return 14;
  }

  return Math.max(2, Math.min(14, Math.floor(budget * 0.55)));
}

function pickColor(context: PatternContext): string {
  return context.random.pick(context.palette) ?? "#ffffff";
}

function createNodes(context: PatternContext, count: number): Circle[] {
  const nodes: Circle[] = [];

  const size = Math.min(context.width, context.height);

  for (let index = 0; index < count; index += 1) {
    const radius =
      index === 0
        ? size * (0.035 + context.random.next() * 0.015)
        : size * (0.012 + context.random.next() * 0.018);

    let cx: number;
    let cy: number;

    if (context.composition) {
      const { region } = context.composition;

      cx = region.x + region.width * (0.1 + context.random.next() * 0.8);

      cy = region.y + region.height * (0.1 + context.random.next() * 0.8);
    } else {
      cx = context.random.int(
        Math.floor(radius),
        Math.floor(context.width - radius),
      );

      cy = context.random.int(
        Math.floor(radius),
        Math.floor(context.height - radius),
      );
    }

    // Keep one larger node as the visual anchor.
    if (index === 0) {
      cx = context.width * 0.35 + context.random.next() * context.width * 0.3;

      cy = context.height * 0.35 + context.random.next() * context.height * 0.3;
    }

    const opacity = index === 0 ? 1 : 0.6 + context.random.next() * 0.25;

    nodes.push({
      type: "circle",
      cx,
      cy,
      radius,
      fill: pickColor(context),
      opacity,
    });
  }

  return nodes;
}

function createConnections(
  context: PatternContext,
  nodes: Circle[],
  maxConnections: number,
): Line[] {
  const connections: Line[] = [];

  const size = Math.min(context.width, context.height);

  const maxDistance =
    size * (0.2 + (context.visualBudget?.density ?? 0.5) * 0.2);

  const lineColor = pickColor(context);

  for (
    let first = 0;
    first < nodes.length && connections.length < maxConnections;
    first += 1
  ) {
    for (
      let second = first + 1;
      second < nodes.length && connections.length < maxConnections;
      second += 1
    ) {
      const a = nodes[first];
      const b = nodes[second];

      const dx = a.cx - b.cx;
      const dy = a.cy - b.cy;

      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > maxDistance) {
        continue;
      }

      const connectionProbability = first === 0 || second === 0 ? 0.8 : 0.45;

      if (context.random.next() > connectionProbability) {
        continue;
      }

      connections.push({
        type: "line",
        x1: a.cx,
        y1: a.cy,
        x2: b.cx,
        y2: b.cy,
        stroke: lineColor,
        strokeWidth:
          size * (0.004 + (context.visualBudget?.contrast ?? 0.5) * 0.003),
        opacity: 0.25 + (context.visualBudget?.contrast ?? 0.5) * 0.2,
      });
    }
  }

  return connections;
}

export const constellationPattern: PatternGenerator = {
  id: "constellation",

  generate(context) {
    const nodeCount = getNodeCount(context);

    const budget = context.visualBudget?.maxElements;

    const maxConnections =
      budget === undefined ? 24 : Math.max(0, budget - nodeCount);

    const nodes = createNodes(context, nodeCount);

    const connections = createConnections(context, nodes, maxConnections);

    const elements: PatternElement[] = [...connections, ...nodes];

    return {
      elements,
    };
  },
};
