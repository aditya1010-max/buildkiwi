/**
 * Test Scope
 * ----------
 * Handles reusable layout and positioning utilities.
 *
 * Covers:
 * - Bounds creation and manipulation
 * - Anchor positioning
 * - Grid and radial distribution
 * - Random point distribution
 * - Clusters
 * - Safe areas
 * - Point sampling
 * - Spacing and interpolation
 *
 * Does not cover:
 * - Composition generation
 * - Pattern generation
 * - Visual budgets
 * - SVG rendering
 */

import { describe, expect, it } from "vitest";

import {
  clampPoint,
  containsPoint,
  createBounds,
  getAnchor,
  getBoundsCenter,
  insetBounds,
  insetBoundsXY,
  offsetPoint,
  createGrid,
  createRadialPositions,
  distributeRandomly,
  createCluster,
  createSafeArea,
  getCompositionSafeArea,
  clampToSafeArea,
  isInsideSafeArea,
  samplePoint,
  samplePoints,
  samplePointWithMargin,
  distributeSpacing,
  lerp,
} from "../src/layout";

import type { Composition, PatternRandom, Point } from "../src/core/types";

describe("layout", () => {
  const bounds = createBounds(10, 20, 100, 80);

  const composition: Composition = {
    id: "center",
    focalPoint: { x: 60, y: 60 },
    region: bounds,
  };

  const random: PatternRandom = {
    next: () => 0.5,
    int: (min) => min,
    pick: <T>(items: readonly T[]) => items[0],
  };

  describe("bounds", () => {
    it("creates bounds and clamps negative dimensions", () => {
      expect(createBounds(10, 20, 100, 80)).toEqual({
        x: 10,
        y: 20,
        width: 100,
        height: 80,
      });

      expect(createBounds(0, 0, -10, -20)).toEqual({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      });
    });

    it("checks and clamps points against bounds", () => {
      const point = { x: 150, y: 0 };

      expect(containsPoint(bounds, { x: 50, y: 50 })).toBe(true);
      expect(containsPoint(bounds, point)).toBe(false);

      expect(clampPoint(point, bounds)).toEqual({
        x: 110,
        y: 20,
      });
    });

    it("calculates centers and inset bounds", () => {
      expect(getBoundsCenter(bounds)).toEqual({
        x: 60,
        y: 60,
      });

      expect(insetBounds(bounds, 10)).toEqual({
        x: 20,
        y: 30,
        width: 80,
        height: 60,
      });

      expect(insetBoundsXY(bounds, 10, 20)).toEqual({
        x: 20,
        y: 40,
        width: 80,
        height: 40,
      });
    });
  });

  describe("anchors", () => {
    it("returns positions relative to the composition region", () => {
      expect(getAnchor(composition, "top-left")).toEqual({
        x: 10,
        y: 20,
      });

      expect(getAnchor(composition, "center")).toEqual({
        x: 60,
        y: 60,
      });

      expect(getAnchor(composition, "bottom-right")).toEqual({
        x: 110,
        y: 100,
      });
    });

    it("offsets a point", () => {
      expect(offsetPoint({ x: 10, y: 20 }, 5, -3)).toEqual({
        x: 15,
        y: 17,
      });
    });
  });

  describe("distribution", () => {
    it("creates grid positions inside the bounds", () => {
      const points = createGrid(bounds, 2, 2);

      expect(points).toHaveLength(4);
      expect(points[0]).toEqual({
        x: 35,
        y: 40,
      });
    });

    it("creates radial positions around a center", () => {
      const points = createRadialPositions({ x: 50, y: 50 }, 10, 4);

      expect(points).toHaveLength(4);
      expect(points[0]).toEqual({
        x: 60,
        y: 50,
      });
    });

    it("handles single and empty distributions", () => {
      const center = { x: 50, y: 50 };

      expect(createRadialPositions(center, 10, 1)).toEqual([center]);
      expect(createRadialPositions(center, 10, 0)).toEqual([]);
      expect(createGrid(bounds, 0, 2)).toEqual([]);
    });
  });

  describe("random distribution", () => {
    it("distributes points within the bounds", () => {
      const points = distributeRandomly(bounds, 3, random);

      expect(points).toHaveLength(3);

      for (const point of points) {
        expect(containsPoint(bounds, point)).toBe(true);
      }
    });
  });

  describe("clusters", () => {
    it("creates a cluster with the requested number of points", () => {
      const cluster = createCluster(bounds, 5, 20, random);

      expect(cluster.points).toHaveLength(5);
      expect(cluster.radius).toBe(20);
      expect(containsPoint(bounds, cluster.center)).toBe(true);
    });

    it("returns no points for a non-positive count", () => {
      const cluster = createCluster(bounds, 0, 20, random);

      expect(cluster.points).toEqual([]);
    });
  });

  describe("safe areas", () => {
    it("creates a padded safe area", () => {
      expect(createSafeArea(200, 100, { padding: 10 })).toEqual({
        x: 10,
        y: 10,
        width: 180,
        height: 80,
      });
    });

    it("creates a safe area from a composition region", () => {
      expect(getCompositionSafeArea(composition, { padding: 10 })).toEqual({
        x: 20,
        y: 30,
        width: 80,
        height: 60,
      });
    });

    it("checks and clamps points inside the safe area", () => {
      const safeArea = createSafeArea(100, 100, {
        padding: 10,
      });

      const outside: Point = { x: 0, y: 150 };

      expect(isInsideSafeArea({ x: 50, y: 50 }, safeArea)).toBe(true);
      expect(isInsideSafeArea(outside, safeArea)).toBe(false);

      expect(clampToSafeArea(outside, safeArea)).toEqual({
        x: 10,
        y: 90,
      });
    });
  });

  describe("sampling", () => {
    it("samples points within the bounds", () => {
      const point = samplePoint(bounds, random);
      const points = samplePoints(bounds, 3, random);

      expect(containsPoint(bounds, point)).toBe(true);
      expect(points).toHaveLength(3);
    });

    it("samples a point inside the requested margin", () => {
      const point = samplePointWithMargin(bounds, 10, random);

      expect(point.x).toBe(60);
      expect(point.y).toBe(60);
    });
  });

  describe("spacing", () => {
    it("distributes values evenly between two endpoints", () => {
      expect(distributeSpacing(3, 0, 10)).toEqual([0, 5, 10]);

      expect(distributeSpacing(1, 0, 10)).toEqual([5]);
      expect(distributeSpacing(0, 0, 10)).toEqual([]);
    });

    it("linearly interpolates between values", () => {
      expect(lerp(0, 100, 0.25)).toBe(25);
      expect(lerp(10, 20, 0.5)).toBe(15);
    });
  });
});
