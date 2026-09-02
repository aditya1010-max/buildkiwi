import { describe, expect, it } from "vitest";
import { generatePalette } from "../src/palettes";

describe("generatePalette", () => {
  it("generates a complete palette", () => {
    const palette = generatePalette("buildkiwi-demo");

    expect(palette.major).toBeTruthy();
    expect(palette.primary).toBeTruthy();
    expect(palette.secondary).toBeTruthy();
    expect(palette.accent).toBeTruthy();
  });

  it("is deterministic", () => {
    const first = generatePalette("buildkiwi-demo");
    const second = generatePalette("buildkiwi-demo");

    expect(first).toEqual(second);
  });

  it("changes when the seed changes", () => {
    const first = generatePalette("buildkiwi-demo");
    const second = generatePalette("buildkiwi-demo-2");

    expect(first).not.toEqual(second);
  });

  it("generates different color relationships", () => {
    const palette = generatePalette("buildkiwi-demo");

    expect(palette.primary).toMatch(/^hsla\(/);
    expect(palette.secondary).toMatch(/^hsla\(/);
    expect(palette.accent).toMatch(/^hsla\(/);
    expect(palette.major).toMatch(/^#/);
  });
});
