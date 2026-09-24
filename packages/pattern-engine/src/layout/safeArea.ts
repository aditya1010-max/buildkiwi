import type { Composition, CompositionRegion, Point } from "../core/types";

export type SafeArea = CompositionRegion;

export type SafeAreaOptions = {
  padding?: number;
  paddingX?: number;
  paddingY?: number;
};

export function createSafeArea(
  width: number,
  height: number,
  options: SafeAreaOptions = {},
): SafeArea {
  const paddingX = options.paddingX ?? options.padding ?? 0;
  const paddingY = options.paddingY ?? options.padding ?? 0;

  return {
    x: paddingX,
    y: paddingY,
    width: Math.max(0, width - paddingX * 2),
    height: Math.max(0, height - paddingY * 2),
  };
}

export function getCompositionSafeArea(
  composition: Composition,
  options: SafeAreaOptions = {},
): SafeArea {
  const paddingX = options.paddingX ?? options.padding ?? 0;
  const paddingY = options.paddingY ?? options.padding ?? 0;

  return {
    x: composition.region.x + paddingX,
    y: composition.region.y + paddingY,
    width: Math.max(0, composition.region.width - paddingX * 2),
    height: Math.max(0, composition.region.height - paddingY * 2),
  };
}

export function clampToSafeArea(point: Point, safeArea: SafeArea): Point {
  return {
    x: Math.min(safeArea.x + safeArea.width, Math.max(safeArea.x, point.x)),
    y: Math.min(safeArea.y + safeArea.height, Math.max(safeArea.y, point.y)),
  };
}

export function isInsideSafeArea(point: Point, safeArea: SafeArea): boolean {
  return (
    point.x >= safeArea.x &&
    point.x <= safeArea.x + safeArea.width &&
    point.y >= safeArea.y &&
    point.y <= safeArea.y + safeArea.height
  );
}
