import type { Point, SeededRandom } from "../core/types";

import type { Bounds } from "./bounds";

export function samplePoint(bounds: Bounds, random: SeededRandom): Point {
  return {
    x: bounds.x + random.next() * bounds.width,
    y: bounds.y + random.next() * bounds.height,
  };
}

export function samplePoints(
  bounds: Bounds,
  count: number,
  random: SeededRandom,
): Point[] {
  return Array.from({ length: Math.max(0, count) }, () =>
    samplePoint(bounds, random),
  );
}

export function samplePointWithMargin(
  bounds: Bounds,
  margin: number,
  random: SeededRandom,
): Point {
  const safeWidth = Math.max(0, bounds.width - margin * 2);
  const safeHeight = Math.max(0, bounds.height - margin * 2);

  return {
    x: bounds.x + margin + random.next() * safeWidth,
    y: bounds.y + margin + random.next() * safeHeight,
  };
}
