import type { Point, CompositionRegion } from "../core/types";

export type Bounds = CompositionRegion;

export function createBounds(
  x: number,
  y: number,
  width: number,
  height: number,
): Bounds {
  return {
    x,
    y,
    width: Math.max(0, width),
    height: Math.max(0, height),
  };
}

export function containsPoint(bounds: Bounds, point: Point): boolean {
  return (
    point.x >= bounds.x &&
    point.x <= bounds.x + bounds.width &&
    point.y >= bounds.y &&
    point.y <= bounds.y + bounds.height
  );
}

export function clampPoint(point: Point, bounds: Bounds): Point {
  return {
    x: Math.min(bounds.x + bounds.width, Math.max(bounds.x, point.x)),
    y: Math.min(bounds.y + bounds.height, Math.max(bounds.y, point.y)),
  };
}

export function getBoundsCenter(bounds: Bounds): Point {
  return {
    x: bounds.x + bounds.width / 2,
    y: bounds.y + bounds.height / 2,
  };
}

export function insetBounds(bounds: Bounds, padding: number): Bounds {
  return {
    x: bounds.x + padding,
    y: bounds.y + padding,
    width: Math.max(0, bounds.width - padding * 2),
    height: Math.max(0, bounds.height - padding * 2),
  };
}

export function insetBoundsXY(
  bounds: Bounds,
  paddingX: number,
  paddingY: number,
): Bounds {
  return {
    x: bounds.x + paddingX,
    y: bounds.y + paddingY,
    width: Math.max(0, bounds.width - paddingX * 2),
    height: Math.max(0, bounds.height - paddingY * 2),
  };
}
