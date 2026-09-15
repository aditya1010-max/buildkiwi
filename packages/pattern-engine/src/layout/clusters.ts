import type {
  Point,
  SeededRandom,
} from "../core/types";

import type { Bounds } from "./bounds";

export type Cluster = {
  center: Point;
  radius: number;
  points: Point[];
};

export function createCluster(
  bounds: Bounds,
  count: number,
  radius: number,
  random: SeededRandom,
): Cluster {
  const center: Point = {
    x: bounds.x + bounds.width * (0.25 + random.next() * 0.5),
    y: bounds.y + bounds.height * (0.25 + random.next() * 0.5),
  };

  const points: Point[] = Array.from(
    { length: Math.max(0, count) },
    () => {
      const angle = random.next() * Math.PI * 2;
      const distance = Math.sqrt(random.next()) * radius;

      return {
        x: center.x + Math.cos(angle) * distance,
        y: center.y + Math.sin(angle) * distance,
      };
    },
  );

  return {
    center,
    radius,
    points,
  };
}