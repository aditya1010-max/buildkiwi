import type { Circle } from "../core/types";
import type { Motif } from "./types";

const RING_COUNT = 4;

export const ringsMotif: Motif = {
  id: "rings",

  generate(context) {
    const { center, scale, opacity, random, palette } = context;

    const elements: Circle[] = [];

    const baseRadius = 20 * scale;

    for (let index = 0; index < RING_COUNT; index += 1) {
      const radius = baseRadius * (index + 1);

      elements.push({
        type: "circle",
        cx: center.x,
        cy: center.y,
        radius,
        fill: "none",
        stroke: random.pick(palette),
        strokeWidth: Math.max(1, 2 * scale),
        opacity: opacity * (1 - index * 0.12),
      });
    }

    return {
      elements,
    };
  },
};
