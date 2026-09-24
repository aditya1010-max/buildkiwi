import type { Circle } from "../core/types";
import type { Motif } from "./types";

const RING_COUNT = 3;
const DOT_COUNT = 2;

export const orbitMotif: Motif = {
  id: "orbit",

  generate(context) {
    const { center, scale, opacity, random, palette } = context;

    const elements: Circle[] = [];

    const baseRadius = 24 * scale;

    for (let index = 0; index < RING_COUNT; index += 1) {
      const radius = baseRadius * (1 + index * 0.65);

      elements.push({
        type: "circle",
        cx: center.x,
        cy: center.y,
        radius,
        fill: "none",
        stroke: random.pick(palette),
        strokeWidth: Math.max(1, 2 * scale),
        opacity: opacity * (1 - index * 0.15),
      });
    }

    for (let index = 0; index < DOT_COUNT; index += 1) {
      const angle = random.next() * Math.PI * 2;
      const radius = baseRadius * (1.5 + random.next() * (RING_COUNT * 0.6));

      elements.push({
        type: "circle",
        cx: center.x + Math.cos(angle) * radius,
        cy: center.y + Math.sin(angle) * radius,
        radius: Math.max(2, 4 * scale),
        fill: random.pick(palette),
        opacity,
      });
    }

    return {
      elements,
    };
  },
};
