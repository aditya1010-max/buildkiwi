import type {
  Composition,
  Point,
} from "../core/types";

export type Anchor =
  | "center"
  | "top-left"
  | "top-center"
  | "top-right"
  | "center-left"
  | "center-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export function getAnchor(
  composition: Composition,
  anchor: Anchor,
): Point {
  const { x, y, width, height } = composition.region;

  switch (anchor) {
    case "top-left":
      return { x, y };

    case "top-center":
      return {
        x: x + width / 2,
        y,
      };

    case "top-right":
      return {
        x: x + width,
        y,
      };

    case "center-left":
      return {
        x,
        y: y + height / 2,
      };

    case "center":
      return {
        x: x + width / 2,
        y: y + height / 2,
      };

    case "center-right":
      return {
        x: x + width,
        y: y + height / 2,
      };

    case "bottom-left":
      return {
        x,
        y: y + height,
      };

    case "bottom-center":
      return {
        x: x + width / 2,
        y: y + height,
      };

    case "bottom-right":
      return {
        x: x + width,
        y: y + height,
      };
  }
}

export function offsetPoint(
  point: Point,
  offsetX: number,
  offsetY: number,
): Point {
  return {
    x: point.x + offsetX,
    y: point.y + offsetY,
  };
}