import type { Line } from "../core/types";
import type { Motif } from "./types";

const GRID_SIZE = 4;

export const gridMotif: Motif = {
  id: "grid",

  generate(context) {
    const { bounds, scale, opacity, random, palette } = context;

    const elements: Line[] = [];

    const width = bounds.width;
    const height = bounds.height;

    const spacingX = width / GRID_SIZE;
    const spacingY = height / GRID_SIZE;

    for (let index = 1; index < GRID_SIZE; index += 1) {
      const x = bounds.x + spacingX * index;

      elements.push({
        type: "line",
        x1: x,
        y1: bounds.y,
        x2: x,
        y2: bounds.y + height,
        stroke: random.pick(palette),
        strokeWidth: Math.max(1, scale),
        opacity: opacity * 0.35,
      });
    }

    for (let index = 1; index < GRID_SIZE; index += 1) {
      const y = bounds.y + spacingY * index;

      elements.push({
        type: "line",
        x1: bounds.x,
        y1: y,
        x2: bounds.x + width,
        y2: y,
        stroke: random.pick(palette),
        strokeWidth: Math.max(1, scale),
        opacity: opacity * 0.35,
      });
    }

    return {
      elements,
    };
  },
};
