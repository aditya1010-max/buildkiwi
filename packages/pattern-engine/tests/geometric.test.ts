import { describe, expect, it } from "vitest";

import { createSeededRandom } from "../src/core/random";
import type {
  ColorSystem,
  PatternContext,
  VisualBudget,
} from "../src/core/types";

import { geometricPattern } from "../src/patterns/geometric";

const colorSystem: ColorSystem = {
  background: "#ffffff",
  surface: "#f3f4f6",
  primary: "#111827",
  secondary: "#6b7280",
  accent: "#6366f1",
  muted: "#9ca3af",
  foreground: "#4c71b0",
};

const visualBudget: VisualBudget = {
  maxElements: 12,
  density: 0.7,
  contrast: 0.7,
  complexity: 0.6,
  accentUsage: 0.2,
};

function createContext(
  seed: string,
  composition:
    | "center"
    | "corner"
    | "diagonal"
    | "radial"
    | "asymmetric"
    | "cluster"
    | "framed"
    | "modular" = "center",
): PatternContext {
  return {
    width: 1200,
    height: 630,
    borderRadius: 24,

    palette: [
      colorSystem.background,
      colorSystem.surface,
      colorSystem.primary,
      colorSystem.secondary,
      colorSystem.accent,
      colorSystem.muted,
    ],

    random: createSeededRandom(seed),

    composition: {
      id: composition,
      focalPoint: {
        x: 600,
        y: 315,
      },
      region: {
        x: 0,
        y: 0,
        width: 1200,
        height: 630,
      },
    },

    colorSystem,
    visualBudget,
  };
}

describe("geometricPattern", () => {
  it("produces deterministic output for the same seed", () => {
    const first = geometricPattern.generate(
      createContext("deterministic-seed", "center"),
    );

    const second = geometricPattern.generate(
      createContext("deterministic-seed", "center"),
    );

    expect(first).toEqual(second);
  });

  it("produces different output for different seeds", () => {
    const first = geometricPattern.generate(createContext("seed-a", "center"));

    const second = geometricPattern.generate(createContext("seed-b", "center"));

    expect(first).not.toEqual(second);
  });

  it("keeps every composition deterministic", () => {
    const compositions = [
      "center",
      "corner",
      "diagonal",
      "radial",
      "asymmetric",
      "cluster",
      "framed",
      "modular",
    ] as const;

    for (const composition of compositions) {
      const first = geometricPattern.generate(
        createContext("composition-seed", composition),
      );

      const second = geometricPattern.generate(
        createContext("composition-seed", composition),
      );

      expect(first).toEqual(second);
    }
  });

  it("respects the visual budget", () => {
    const context = createContext("budget-seed", "modular");

    const output = geometricPattern.generate(context);

    expect(output.elements.length).toBeLessThanOrEqual(
      context.visualBudget!.maxElements,
    );
  });

  it("preserves composition-specific output", () => {
    const center = geometricPattern.generate(
      createContext("same-seed", "center"),
    );

    const diagonal = geometricPattern.generate(
      createContext("same-seed", "diagonal"),
    );

    const cluster = geometricPattern.generate(
      createContext("same-seed", "cluster"),
    );

    expect(center).not.toEqual(diagonal);
    expect(diagonal).not.toEqual(cluster);
    expect(center).not.toEqual(cluster);
  });
});
