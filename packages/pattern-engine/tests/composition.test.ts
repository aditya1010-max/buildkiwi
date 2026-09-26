/**
 * Test Scope
 * ----------
 * Handles composition registration and generation.
 *
 * Covers:
 * - Composition registry
 * - Composition lookup
 * - Default composition
 * - Registered composition generation
 * - Composition dimensions and regions
 * - Deterministic composition generation
 *
 * Does not cover:
 * - Layout utilities
 * - Pattern generation
 * - Visual budgets
 * - SVG rendering
 */

import { describe, expect, it } from "vitest";

import {
  getComposition,
  getCompositions,
  getDefaultComposition,
} from "../src/composition";

import type { CompositionContext } from "../src/core/types";

describe("composition", () => {
  const context: CompositionContext = {
    width: 400,
    height: 300,
    random: {
      next: () => 0.5,
      int: (min) => min,
      pick: <T>(items: readonly T[]) => items[0],
    },
  };

  describe("registry", () => {
    it("registers all supported compositions", () => {
      const compositions = getCompositions();

      expect(compositions).toHaveLength(8);

      expect(compositions.map((composition) => composition.id)).toEqual(
        expect.arrayContaining([
          "center",
          "corner",
          "diagonal",
          "radial",
          "asymmetric",
          "cluster",
          "framed",
          "modular",
        ]),
      );
    });

    it("returns the requested composition", () => {
      expect(getComposition("center").id).toBe("center");
      expect(getComposition("radial").id).toBe("radial");
      expect(getComposition("modular").id).toBe("modular");
    });

    it("returns center as the default composition", () => {
      expect(getDefaultComposition().id).toBe("center");
    });
  });

  describe("generation", () => {
    it("generates a valid center composition", () => {
      const composition = getComposition("center").generate(context);

      expect(composition.id).toBe("center");
      expect(composition.focalPoint).toEqual({
        x: 200,
        y: 150,
      });
      expect(composition.region).toEqual({
        x: 80,
        y: 60,
        width: 240,
        height: 180,
      });
    });

    it("generates a full-canvas radial composition", () => {
      const composition = getComposition("radial").generate(context);

      expect(composition.focalPoint).toEqual({
        x: 200,
        y: 150,
      });

      expect(composition.region).toEqual({
        x: 0,
        y: 0,
        width: 400,
        height: 300,
      });
    });

    it("generates valid regions for every composition", () => {
      for (const generator of getCompositions()) {
        const composition = generator.generate(context);

        expect(composition.id).toBe(generator.id);
        expect(composition.region.width).toBeGreaterThanOrEqual(0);
        expect(composition.region.height).toBeGreaterThanOrEqual(0);
      }
    });

    it("produces expected properties for varied compositions", () => {
      const diagonal = getComposition("diagonal").generate(context);
      const framed = getComposition("framed").generate(context);
      const modular = getComposition("modular").generate(context);

      expect(diagonal.rotation).toBeDefined();
      expect(framed.scale).toBe(0.85);
      expect(modular.scale).toBe(0.825);
    });
  });

  describe("determinism", () => {
    it("produces the same composition for the same random sequence", () => {
      const createContext = (): CompositionContext => ({
        width: 400,
        height: 300,
        random: {
          next: () => 0.5,
          int: (min) => min,
          pick: <T>(items: readonly T[]) => items[0],
        },
      });

      const first = getComposition("asymmetric").generate(createContext());

      const second = getComposition("asymmetric").generate(createContext());

      expect(first).toEqual(second);
    });
  });
});
