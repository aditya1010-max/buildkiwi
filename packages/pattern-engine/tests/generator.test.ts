/**
 * Test Scope
 * ----------
 * Handles the core pattern generation pipeline.
 *
 * Covers:
 * - Pattern configuration
 * - Pattern resolution
 * - Deterministic generation
 * - Output dimensions
 * - Theme integration
 * - Color system resolution
 * - Background handling
 * - Visual budget enforcement
 * - Ring generation
 * - Generator integration
 *
 * Does not cover:
 * - Asset generation
 * - Asset presets
 * - Asset request resolution
 * - Individual pattern implementation details
 * - Low-level SVG serialization
 */

import { describe, expect, it } from "vitest";

import { generatePattern } from "../src/core/generator";

describe("generatePattern", () => {
  const baseConfig = {
    seed: "generator-test",
    pattern: "geometric" as const,
    width: 400,
    height: 300,
  };

  describe("basic generation", () => {
    it("generates an image from a valid pattern configuration", () => {
      const result = generatePattern(baseConfig);

      expect(result).toBeDefined();
      expect(result.svg).toBeTypeOf("string");
    });

    it("generates output with the requested dimensions", () => {
      const result = generatePattern(baseConfig);

      expect(result.width).toBe(400);
      expect(result.height).toBe(300);
    });

    it("generates SVG output", () => {
      const result = generatePattern(baseConfig);

      expect(result.svg).toContain("<svg");
      expect(result.svg).toContain("</svg>");
    });
  });

  describe("determinism", () => {
    it("produces identical output for the same configuration", () => {
      const first = generatePattern(baseConfig);
      const second = generatePattern(baseConfig);

      expect(first).toEqual(second);
    });

    it("produces different output for different seeds", () => {
      const first = generatePattern({
        ...baseConfig,
        seed: "seed-a",
      });

      const second = generatePattern({
        ...baseConfig,
        seed: "seed-b",
      });

      expect(first.svg).not.toBe(second.svg);
    });
  });

  describe("dimensions", () => {
    it("preserves custom dimensions", () => {
      const result = generatePattern({
        ...baseConfig,
        width: 1200,
        height: 630,
      });

      expect(result.width).toBe(1200);
      expect(result.height).toBe(630);
    });
  });

  describe("background", () => {
    it("uses the configured background", () => {
      const result = generatePattern({
        ...baseConfig,
        background: "#123456",
      });

      expect(result.svg).toContain("#123456");
    });
  });

  describe("color system", () => {
    it("uses the provided color system", () => {
      const result = generatePattern({
        ...baseConfig,
        colorSystem: {
          background: "#111111",
          surface: "#222222",
          primary: "#333333",
          secondary: "#444444",
          accent: "#555555",
          muted: "#666666",
          foreground: "#777777",
        },
      });

      expect(result.svg).toContain("#111111");
    });
  });

  describe("visual budget", () => {
    it("accepts an explicit visual budget", () => {
      const result = generatePattern({
        ...baseConfig,
        visualBudget: {
          maxElements: 5,
          density: 0.5,
          contrast: 0.5,
          complexity: 0.5,
          accentUsage: 0.5,
        },
      });

      expect(result).toBeDefined();
      expect(result.svg).toContain("<svg");
    });

    it("supports a zero-element budget", () => {
      const result = generatePattern({
        ...baseConfig,
        visualBudget: {
          maxElements: 0,
          density: 0.5,
          contrast: 0.5,
          complexity: 0.5,
          accentUsage: 0.5,
        },
      });

      expect(result).toBeDefined();
      expect(result.svg).toContain("<svg");
    });
  });

  describe("ring", () => {
    it("adds a ring when ring configuration is provided", () => {
      const withoutRing = generatePattern(baseConfig);

      const withRing = generatePattern({
        ...baseConfig,
        ring: {
          color: "#ff0000",
          width: 4,
        },
      });

      expect(withRing.svg).not.toBe(withoutRing.svg);
      expect(withRing.svg).toContain("#ff0000");
    });
  });
});
