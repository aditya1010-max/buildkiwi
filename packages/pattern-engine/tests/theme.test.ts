/**
 * Test Scope
 * ----------
 * Handles pattern-theme resolution and theme configuration.
 *
 * Covers:
 * - Theme resolution
 * - Registered pattern themes
 * - Default theme fallback
 * - Theme color systems
 * - Theme backgrounds
 * - Theme visual budgets
 *
 * Does not cover:
 * - Palette algorithms
 * - Pattern rendering
 * - Pattern generation
 * - Visual budget enforcement
 * - SVG serialization
 */

import { describe, expect, it } from "vitest";

import { resolvePatternTheme } from "../src/themes";

import type { PatternId } from "../src/core/types";

describe("resolvePatternTheme", () => {
  it("resolves the registered geometric theme", () => {
    const theme = resolvePatternTheme("geometric");

    expect(theme).toBeDefined();
    expect(theme.colorSystem).toEqual({
      background: "#fff4f8",
      surface: "#eefaf4",
      primary: "#7c6fe8",
      secondary: "#5fc7a3",
      accent: "#67b9e8",
      muted: "#f0a6c8",
      foreground: "#465568",
    });
  });

  it("includes the geometric background configuration", () => {
    const theme = resolvePatternTheme("geometric");

    expect(theme.background).toEqual({
      type: "gradient",
      colors: [
        "#d5cf87",
        "#d5a787",
        "#d58787",
        "#91d587",
        "#87d5b3",
        "#87a6d5",
        "#8787d5",
      ],
      opacity: 0.85,
    });
  });

  it("includes the geometric visual budget", () => {
    const theme = resolvePatternTheme("geometric");

    expect(theme.visualBudget).toEqual({
      maxElements: 12,
      density: 0.7,
      contrast: 1,
      complexity: 0.6,
      accentUsage: 0.2,
    });
  });

  it("falls back to the default theme for an unregistered pattern", () => {
    const theme = resolvePatternTheme("blobs");

    expect(theme).toBeDefined();
    expect(theme.colorSystem).toBeDefined();
    expect(theme.background).toBeDefined();
  });

  it("returns the default theme for different unregistered patterns", () => {
    const first = resolvePatternTheme("unknown-pattern-a" as PatternId);
    const second = resolvePatternTheme("unknown-pattern-b" as PatternId);

    expect(first).toEqual(second);
  });
});
