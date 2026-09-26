/**
 * Test Scope
 * ----------
 * Handles reusable motif generation.
 *
 * Covers:
 * - Motif exports
 * - Grid motif generation
 * - Orbit motif generation
 * - Rings motif generation
 * - Element counts
 * - Basic motif geometry
 *
 * Does not cover:
 * - Layout utilities
 * - Composition generation
 * - Pattern generation
 * - SVG serialization
 */

import { describe, expect, it } from "vitest";

import { gridMotif, orbitMotif, ringsMotif } from "../src/motifs";

import type { MotifContext } from "../src/motifs/types";

describe("motifs", () => {
  const context: MotifContext = {
    bounds: {
      x: 10,
      y: 20,
      width: 100,
      height: 80,
    },
    center: {
      x: 60,
      y: 60,
    },
    scale: 1,
    opacity: 0.8,
    palette: ["#111111", "#222222", "#333333"],
    random: {
      next: () => 0.5,
      int: (min) => min,
      pick: <T>(items: readonly T[]) => items[0],
    },
  };

  describe("grid", () => {
    it("generates the expected grid lines", () => {
      const result = gridMotif.generate(context);

      expect(result.elements).toHaveLength(6);
      expect(result.elements.every((element) => element.type === "line")).toBe(
        true,
      );
    });

    it("uses the motif bounds for its lines", () => {
      const result = gridMotif.generate(context);

      const first = result.elements[0];

      expect(first).toMatchObject({
        type: "line",
        x1: 35,
        y1: 20,
        x2: 35,
        y2: 100,
      });
    });
  });

  describe("orbit", () => {
    it("generates rings and orbiting dots", () => {
      const result = orbitMotif.generate(context);

      expect(result.elements).toHaveLength(5);

      expect(
        result.elements.filter((element) => element.type === "circle"),
      ).toHaveLength(5);
    });

    it("centers the orbit rings on the provided center", () => {
      const result = orbitMotif.generate(context);

      const first = result.elements[0];

      expect(first).toMatchObject({
        type: "circle",
        cx: 60,
        cy: 60,
        radius: 24,
      });
    });
  });

  describe("rings", () => {
    it("generates the expected number of rings", () => {
      const result = ringsMotif.generate(context);

      expect(result.elements).toHaveLength(4);
      expect(
        result.elements.every((element) => element.type === "circle"),
      ).toBe(true);
    });

    it("centers all rings on the provided center", () => {
      const result = ringsMotif.generate(context);

      for (const element of result.elements) {
        expect(element).toMatchObject({
          type: "circle",
          cx: 60,
          cy: 60,
          fill: "none",
        });
      }
    });
  });
});
