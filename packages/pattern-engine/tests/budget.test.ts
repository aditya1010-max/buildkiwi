/**
 * Test Scope
 * ----------
 * Handles visual-budget resolution and enforcement.
 *
 * Covers:
 * - Default budgets
 * - Custom budgets
 * - Budget constraints
 * - Minimum and maximum limits
 * - Budget resolution
 * - Primitive-count limits
 * - Density scaling
 * - Element limiting
 * - Deterministic shuffling and limiting
 * - Accent usage
 * - Opacity calculation
 * - Value clamping
 *
 * Does not cover:
 * - Pattern visual quality
 * - Pattern generation
 * - SVG serialization
 */

import { describe, expect, it } from "vitest";

import {
  getDefaultVisualBudget,
  resolveVisualBudget,
  getElementLimit,
  scaleCount,
  limitElements,
  shuffleAndLimit,
  shouldUseAccent,
  getOpacity,
  clamp01,
} from "../src/budget";

import type {
  PatternElement,
  SeededRandom,
  VisualBudget,
} from "../src/core/types";

describe("budget", () => {
  describe("getDefaultVisualBudget", () => {
    it("returns the default cover budget", () => {
      const budget = getDefaultVisualBudget("cover");

      expect(budget).toEqual({
        maxElements: 28,
        density: 0.45,
        contrast: 0.65,
        complexity: 0.55,
        accentUsage: 0.2,
      });
    });

    it("returns the default profile budget", () => {
      const budget = getDefaultVisualBudget("profile");

      expect(budget).toEqual({
        maxElements: 16,
        density: 0.3,
        contrast: 0.55,
        complexity: 0.4,
        accentUsage: 0.15,
      });
    });
  });

  describe("resolveVisualBudget", () => {
    it("resolves the budget for a cover asset", () => {
      const budget = resolveVisualBudget({
        type: "cover",
        seed: "test-seed",
      });

      expect(budget).toEqual(getDefaultVisualBudget("cover"));
    });

    it("resolves the budget for a profile asset", () => {
      const budget = resolveVisualBudget({
        type: "profile",
        seed: "test-seed",
      });

      expect(budget).toEqual(getDefaultVisualBudget("profile"));
    });
  });

  describe("getElementLimit", () => {
    const budget: VisualBudget = {
      maxElements: 10,
      density: 0.5,
      contrast: 0.5,
      complexity: 0.5,
      accentUsage: 0.5,
    };

    it("limits requested elements to the budget maximum", () => {
      expect(getElementLimit(budget, 20)).toBe(10);
    });

    it("returns the requested count when it is below the maximum", () => {
      expect(getElementLimit(budget, 6)).toBe(6);
    });

    it("floors fractional requested counts", () => {
      expect(getElementLimit(budget, 6.9)).toBe(6);
    });

    it("returns zero for zero requested elements", () => {
      expect(getElementLimit(budget, 0)).toBe(0);
    });

    it("returns zero for negative requested elements", () => {
      expect(getElementLimit(budget, -5)).toBe(0);
    });

    it("returns zero for non-finite requested counts", () => {
      expect(getElementLimit(budget, Infinity)).toBe(0);
      expect(getElementLimit(budget, -Infinity)).toBe(0);
      expect(getElementLimit(budget, NaN)).toBe(0);
    });

    it("handles fractional maximum element budgets", () => {
      const fractionalBudget = {
        ...budget,
        maxElements: 5.9,
      };

      expect(getElementLimit(fractionalBudget, 10)).toBe(5);
    });

    it("does not allow a negative maximum element budget", () => {
      const negativeBudget = {
        ...budget,
        maxElements: -5,
      };

      expect(getElementLimit(negativeBudget, 10)).toBe(0);
    });
  });

  describe("scaleCount", () => {
    const budget: VisualBudget = {
      maxElements: 20,
      density: 0.5,
      contrast: 0.5,
      complexity: 0.5,
      accentUsage: 0.5,
    };

    it("scales a count according to density", () => {
      expect(scaleCount(10, budget)).toBe(5);
    });

    it("rounds the scaled count", () => {
      expect(scaleCount(5, budget)).toBe(3);
    });

    it("returns at least one element for a positive base count", () => {
      const lowDensityBudget = {
        ...budget,
        density: 0,
      };

      expect(scaleCount(10, lowDensityBudget)).toBe(1);
    });

    it("returns zero for a zero base count", () => {
      expect(scaleCount(0, budget)).toBe(0);
    });

    it("returns zero for a negative base count", () => {
      expect(scaleCount(-10, budget)).toBe(0);
    });

    it("clamps density below zero", () => {
      const lowDensityBudget = {
        ...budget,
        density: -1,
      };

      expect(scaleCount(10, lowDensityBudget)).toBe(1);
    });

    it("clamps density above one", () => {
      const highDensityBudget = {
        ...budget,
        density: 2,
      };

      expect(scaleCount(10, highDensityBudget)).toBe(10);
    });
  });

  describe("limitElements", () => {
    const elements: PatternElement[] = [
      { type: "circle", cx: 0, cy: 0, radius: 5 },
      { type: "circle", cx: 10, cy: 10, radius: 5 },
      { type: "circle", cx: 20, cy: 20, radius: 5 },
      { type: "circle", cx: 30, cy: 30, radius: 5 },
      { type: "circle", cx: 40, cy: 40, radius: 5 },
    ];

    it("keeps elements within the budget", () => {
      const budget: VisualBudget = {
        maxElements: 3,
        density: 0.5,
        contrast: 0.5,
        complexity: 0.5,
        accentUsage: 0.5,
      };

      const result = limitElements(elements, budget);

      expect(result).toHaveLength(3);
    });

    it("returns all elements when within the budget", () => {
      const budget: VisualBudget = {
        maxElements: 10,
        density: 0.5,
        contrast: 0.5,
        complexity: 0.5,
        accentUsage: 0.5,
      };

      const result = limitElements(elements, budget);

      expect(result).toEqual(elements);
    });

    it("returns an empty collection for a zero budget", () => {
      const budget: VisualBudget = {
        maxElements: 0,
        density: 0.5,
        contrast: 0.5,
        complexity: 0.5,
        accentUsage: 0.5,
      };

      expect(limitElements(elements, budget)).toEqual([]);
    });

    it("does not mutate the input when limiting", () => {
      const budget: VisualBudget = {
        maxElements: 2,
        density: 0.5,
        contrast: 0.5,
        complexity: 0.5,
        accentUsage: 0.5,
      };

      const original = [...elements];

      limitElements(elements, budget);

      expect(elements).toEqual(original);
    });
  });

  describe("shuffleAndLimit", () => {
    const elements: PatternElement[] = [
      { type: "circle", cx: 0, cy: 0, radius: 5 },
      { type: "circle", cx: 10, cy: 10, radius: 5 },
      { type: "circle", cx: 20, cy: 20, radius: 5 },
      { type: "circle", cx: 30, cy: 30, radius: 5 },
      { type: "circle", cx: 40, cy: 40, radius: 5 },
    ];

    const budget: VisualBudget = {
      maxElements: 3,
      density: 0.5,
      contrast: 0.5,
      complexity: 0.5,
      accentUsage: 0.5,
    };

    const createRandom = (values: number[]): SeededRandom => {
      let index = 0;

      return {
        next: () => values[index++ % values.length],
        int: (min, max) => {
          const value = values[index++ % values.length];
          return Math.floor(value * (max - min + 1)) + min;
        },
        pick: <T>(items: readonly T[]) => items[0],
      };
    };

    it("limits elements to the budget maximum", () => {
      const random = createRandom([0.1, 0.5, 0.9]);

      const result = shuffleAndLimit(elements, budget, random);

      expect(result).toHaveLength(3);
    });

    it("returns all elements when within the budget", () => {
      const random = createRandom([0.1]);

      const result = shuffleAndLimit(
        elements,
        {
          ...budget,
          maxElements: 10,
        },
        random,
      );

      expect(result).toEqual(elements);
    });

    it("does not mutate the original collection", () => {
      const random = createRandom([0.1, 0.5, 0.9]);
      const original = [...elements];

      shuffleAndLimit(elements, budget, random);

      expect(elements).toEqual(original);
    });
  });

  describe("shouldUseAccent", () => {
    const budget: VisualBudget = {
      maxElements: 10,
      density: 0.5,
      contrast: 0.5,
      complexity: 0.5,
      accentUsage: 0.5,
    };

    it("returns true when the random value is below accent usage", () => {
      const random = {
        next: () => 0.2,
        int: () => 0,
        pick: <T>(items: readonly T[]) => items[0],
      };

      expect(shouldUseAccent(budget, random)).toBe(true);
    });

    it("returns false when the random value is above accent usage", () => {
      const random = {
        next: () => 0.8,
        int: () => 0,
        pick: <T>(items: readonly T[]) => items[0],
      };

      expect(shouldUseAccent(budget, random)).toBe(false);
    });

    it("never uses accent when accent usage is zero", () => {
      const random = {
        next: () => 0,
        int: () => 0,
        pick: <T>(items: readonly T[]) => items[0],
      };

      expect(
        shouldUseAccent(
          {
            ...budget,
            accentUsage: 0,
          },
          random,
        ),
      ).toBe(false);
    });

    it("always uses accent when accent usage is one and random is below one", () => {
      const random = {
        next: () => 0.99,
        int: () => 0,
        pick: <T>(items: readonly T[]) => items[0],
      };

      expect(
        shouldUseAccent(
          {
            ...budget,
            accentUsage: 1,
          },
          random,
        ),
      ).toBe(true);
    });
  });

  describe("getOpacity", () => {
    it("adjusts opacity according to contrast", () => {
      const budget: VisualBudget = {
        maxElements: 10,
        density: 0.5,
        contrast: 0.5,
        complexity: 0.5,
        accentUsage: 0.5,
      };

      expect(getOpacity(1, budget)).toBeCloseTo(0.825);
    });

    it("clamps the result to one", () => {
      const budget: VisualBudget = {
        maxElements: 10,
        density: 0.5,
        contrast: 1,
        complexity: 0.5,
        accentUsage: 0.5,
      };

      expect(getOpacity(2, budget)).toBe(1);
    });

    it("clamps negative base opacity to zero", () => {
      const budget: VisualBudget = {
        maxElements: 10,
        density: 0.5,
        contrast: 0.5,
        complexity: 0.5,
        accentUsage: 0.5,
      };

      expect(getOpacity(-1, budget)).toBe(0);
    });

    it("clamps contrast below zero", () => {
      const budget: VisualBudget = {
        maxElements: 10,
        density: 0.5,
        contrast: -1,
        complexity: 0.5,
        accentUsage: 0.5,
      };

      expect(getOpacity(1, budget)).toBeCloseTo(0.65);
    });

    it("clamps contrast above one", () => {
      const budget: VisualBudget = {
        maxElements: 10,
        density: 0.5,
        contrast: 2,
        complexity: 0.5,
        accentUsage: 0.5,
      };

      expect(getOpacity(1, budget)).toBe(1);
    });
  });

  describe("clamp01", () => {
    it("keeps values inside the range unchanged", () => {
      expect(clamp01(0)).toBe(0);
      expect(clamp01(0.5)).toBe(0.5);
      expect(clamp01(1)).toBe(1);
    });

    it("clamps values below zero", () => {
      expect(clamp01(-1)).toBe(0);
    });

    it("clamps values above one", () => {
      expect(clamp01(2)).toBe(1);
    });
  });
});
