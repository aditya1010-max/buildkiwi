/**
 * Test Scope
 * ----------
 * Handles the geometric pattern generator.
 *
 * Covers:
 * - Geometric pattern generation
 * - Generated circle structure
 * - Circle positioning and sizing
 * - Deterministic generation
 * - Visual-budget integration
 * - Motif integration
 *
 * Does not cover:
 * - Motif implementation details
 * - Layout utilities
 * - Palette generation
 * - Theme resolution
 * - SVG serialization
 */

import { describe, expect, it } from "vitest";

import { geometricPattern } from "../src/patterns/geometric";

import type { PatternContext, PatternElement } from "../src/core/types";

function createContext(randomValue = 0.5, maxElements = 12): PatternContext {
  return {
    width: 400,
    height: 300,
    palette: ["#111111", "#222222", "#333333", "#444444", "#555555", "#666666"],
    random: {
      next: () => randomValue,
      int: (min) => min,
      pick: <T>(items: readonly T[]) => items[0],
    },
    visualBudget: {
      maxElements,
      density: 0.7,
      contrast: 1,
      complexity: 0.6,
      accentUsage: 0.2,
    },
  };
}

describe("geometricPattern", () => {
  it("identifies itself as the geometric pattern", () => {
    expect(geometricPattern.id).toBe("geometric");
  });

  it("generates pattern elements", () => {
    const result = geometricPattern.generate(createContext());

    expect(result.elements.length).toBeGreaterThan(0);
  });

  it("generates valid circles within the padded canvas", () => {
    const result = geometricPattern.generate(createContext(0.9));

    const circles = result.elements.filter(
      (element): element is Extract<PatternElement, { type: "circle" }> =>
        element.type === "circle",
    );

    expect(circles.length).toBeGreaterThanOrEqual(5);

    for (const circle of circles) {
      expect(circle.cx).toBeGreaterThanOrEqual(32);
      expect(circle.cx).toBeLessThanOrEqual(368);

      expect(circle.cy).toBeGreaterThanOrEqual(24);
      expect(circle.cy).toBeLessThanOrEqual(276);

      expect(circle.radius).toBeGreaterThan(0);
      expect(circle.opacity).toBeGreaterThanOrEqual(0.55);
      expect(circle.opacity).toBeLessThanOrEqual(0.82);
    }
  });

  it("respects a smaller visual budget for base circles", () => {
    const result = geometricPattern.generate(createContext(0.5, 6));

    const circles = result.elements.filter(
      (element) => element.type === "circle",
    );

    expect(circles.length).toBeGreaterThanOrEqual(5);
  });

  it("produces deterministic output for the same random sequence", () => {
    const first = geometricPattern.generate(createContext(0.5));
    const second = geometricPattern.generate(createContext(0.5));

    expect(first).toEqual(second);
  });

  it("can generate motif elements", () => {
    const result = geometricPattern.generate(createContext(0.1));

    expect(result.elements.length).toBeGreaterThan(5);
  });
});
