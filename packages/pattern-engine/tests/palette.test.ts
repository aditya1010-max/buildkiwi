/**
 * Test Scope
 * ----------
 * Handles palette generation, color harmony utilities,
 * and color-system validation.
 *
 * Covers:
 * - Deterministic palette generation
 * - Palette structure
 * - Color harmony selection
 * - Hue normalization
 * - Harmony hue calculations
 * - Color-system validation
 *
 * Does not cover:
 * - Pattern rendering
 * - Theme resolution
 * - Visual budgets
 * - SVG generation
 */

import { describe, expect, it } from "vitest";

import { generatePalette } from "../src/palettes";
import {
  analogousHue,
  complementaryHue,
  normalizeHue,
  selectColorHarmony,
  splitComplementaryHues,
} from "../src/palettes/harmony";
import { validateColorSystem } from "../src/palettes/validation";

describe("palette", () => {
  describe("generatePalette", () => {
    it("generates a complete color system", () => {
      const palette = generatePalette("test-seed");

      expect(palette).toEqual(
        expect.objectContaining({
          background: expect.any(String),
          surface: expect.any(String),
          primary: expect.any(String),
          secondary: expect.any(String),
          accent: expect.any(String),
          muted: expect.any(String),
          foreground: expect.any(String),
        }),
      );
    });

    it("produces deterministic palettes for the same seed", () => {
      const first = generatePalette("test-seed");
      const second = generatePalette("test-seed");

      expect(first).toEqual(second);
    });

    it("produces different palettes for different seeds", () => {
      const first = generatePalette("seed-a");
      const second = generatePalette("seed-b");

      expect(first).not.toEqual(second);
    });
  });

  describe("harmony", () => {
    const random = {
      next: () => 0.5,
      int: (min: number) => min,
      pick: <T>(items: readonly T[]) => items[0],
    };

    it("selects a supported color harmony", () => {
      expect(selectColorHarmony(random)).toBe("analogous");
    });

    it("normalizes hues into the 0–359 range", () => {
      expect(normalizeHue(360)).toBe(0);
      expect(normalizeHue(390)).toBe(30);
      expect(normalizeHue(-30)).toBe(330);
    });

    it("calculates harmony hue relationships", () => {
      expect(analogousHue(100, 30)).toBe(130);
      expect(complementaryHue(100)).toBe(280);
      expect(splitComplementaryHues(100)).toEqual([250, 310]);
    });

    it("wraps harmony hues around the color wheel", () => {
      expect(analogousHue(350, 30)).toBe(20);
      expect(complementaryHue(300)).toBe(120);
    });
  });

  describe("validation", () => {
    const validColors = {
      background: "#111111",
      surface: "rgb(20, 20, 20)",
      primary: "hsl(200, 60%, 50%)",
      secondary: "oklch(60% 0.2 200)",
      accent: "color(display-p3 1 0 0)",
      muted: "#888888",
      foreground: "#ffffff",
    };

    it("accepts supported color formats", () => {
      expect(() => validateColorSystem(validColors)).not.toThrow();
    });

    it("rejects an empty color value", () => {
      expect(() =>
        validateColorSystem({
          ...validColors,
          accent: "",
        }),
      ).toThrow('Invalid color for "accent"');
    });

    it("rejects unsupported color formats", () => {
      expect(() =>
        validateColorSystem({
          ...validColors,
          primary: "blue",
        }),
      ).toThrow('Invalid color for "primary"');
    });
  });
});
