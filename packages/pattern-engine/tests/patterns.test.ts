/**
 * Test Scope
 * ----------
 * Handles the shared contract of pattern generators.
 *
 * Covers:
 * - Pattern generator identity
 * - Pattern element generation
 * - Supported element types
 * - Palette usage
 * - Deterministic generation
 * - Visual-budget compatibility
 *
 * Does not cover:
 * - Individual pattern algorithms
 * - Geometric-specific behavior
 * - Motif implementation
 * - Layout utilities
 * - SVG serialization
 */

import { describe, expect, it } from "vitest";

import { blobsPattern } from "../src/patterns/blobs";
import { constellationPattern } from "../src/patterns/constellation";
import { geometricPattern } from "../src/patterns/geometric";
import { halftonePattern } from "../src/patterns/halftone";
import { wavesPattern } from "../src/patterns/waves";

import type { PatternGenerator, PatternContext } from "../src/core/types";

const patterns: PatternGenerator[] = [
  blobsPattern,
  constellationPattern,
  geometricPattern,
  halftonePattern,
  wavesPattern,
];

const palette = [
  "#111111",
  "#222222",
  "#333333",
  "#444444",
  "#555555",
  "#666666",
];

function createContext(): PatternContext {
  return {
    width: 400,
    height: 300,
    palette,

    random: {
      next: () => 0.5,
      int: (min) => min,
      pick: <T>(items: readonly T[]) => items[0],
    },

    visualBudget: {
      maxElements: 12,
      density: 0.7,
      contrast: 0.8,
      complexity: 0.6,
      accentUsage: 0.2,
    },

    colorSystem: {
      background: "#000000",
      surface: "#111111",
      primary: "#222222",
      secondary: "#333333",
      accent: "#444444",
      muted: "#555555",
      foreground: "#ffffff",
    },
  };
}

describe("patterns", () => {
  describe("pattern contract", () => {
    it("provides all supported pattern generators", () => {
      expect(patterns).toHaveLength(5);

      expect(patterns.map((pattern) => pattern.id)).toEqual([
        "blobs",
        "constellation",
        "geometric",
        "halftone",
        "waves",
      ]);
    });

    it("generates elements for every pattern", () => {
      for (const pattern of patterns) {
        const result = pattern.generate(createContext());

        expect(result.elements.length).toBeGreaterThan(0);
      }
    });

    it("generates only supported pattern elements", () => {
      const supportedTypes = new Set([
        "circle",
        "rectangle",
        "polygon",
        "line",
        "path",
      ]);

      for (const pattern of patterns) {
        const result = pattern.generate(createContext());

        for (const element of result.elements) {
          expect(supportedTypes).toContain(element.type);
        }
      }
    });
  });

  describe("determinism", () => {
    it("produces identical output for the same random sequence", () => {
      for (const pattern of patterns) {
        const first = pattern.generate(createContext());
        const second = pattern.generate(createContext());

        expect(first).toEqual(second);
      }
    });
  });

  describe("visual budget", () => {
    it("accepts a smaller visual budget", () => {
      const context = createContext();

      context.visualBudget = {
        maxElements: 5,
        density: 0.5,
        contrast: 0.5,
        complexity: 0.5,
        accentUsage: 0.2,
      };

      for (const pattern of patterns) {
        const result = pattern.generate(context);

        expect(result.elements.length).toBeGreaterThan(0);
      }
    });
  });
});
