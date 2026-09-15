import type {
  Point,
  SeededRandom,
} from "../core/types";

import type { Bounds } from "./bounds";

export function createGrid(
  bounds: Bounds,
  columns: number,
  rows: number,
): Point[] {
  if (columns <= 0 || rows <= 0) {
    return [];
  }

  const points: Point[] = [];

  const cellWidth = bounds.width / columns;
  const cellHeight = bounds.height / rows;

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      points.push({
        x: bounds.x + cellWidth * (column + 0.5),
        y: bounds.y + cellHeight * (row + 0.5),
      });
    }
  }

  return points;
}

export function createRadialPositions(
  center: Point,
  radius: number,
  count: number,
  startAngle = 0,
): Point[] {
  if (count <= 0) {
    return [];
  }

  if (count === 1) {
    return [center];
  }

  const angleStep = (Math.PI * 2) / count;

  return Array.from(
    { length: count },
    (_, index) => {
      const angle = startAngle + angleStep * index;

      return {
        x: center.x + Math.cos(angle) * radius,
        y: center.y + Math.sin(angle) * radius,
      };
    },
  );
}

export function distributeRandomly(
  bounds: Bounds,
  count: number,
  random: SeededRandom,
): Point[] {
  if (count <= 0) {
    return [];
  }

  return Array.from(
    { length: count },
    () => ({
      x: bounds.x + random.next() * bounds.width,
      y: bounds.y + random.next() * bounds.height,
    }),
  );
}