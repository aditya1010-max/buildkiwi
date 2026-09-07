import { describe, expect, it } from "vitest";
import { generatePattern } from "../src";

const config = {
  seed: "buildkiwi-test",
  pattern: "geometric" as const,
  width: 512,
  height: 512,
  borderRadius: 999,
  palette: ["#111111", "#555555", "#999999"],
};

describe("generatePattern", () => {
  it("generates an SVG image", () => {
    const result = generatePattern(config);

    expect(result.width).toBe(512);
    expect(result.height).toBe(512);
    expect(result.svg).toContain("<svg");
    expect(result.svg).toContain("<defs>");
    expect(result.svg).toContain("<linearGradient");
    expect(result.svg).toContain('id="background-gradient-buildkiwi-test"');
    expect(result.svg).toContain("<circle");
    expect(result.svg).toContain("<rect");
  });

  it("is deterministic", () => {
    const first = generatePattern(config);
    const second = generatePattern(config);

    expect(first).toEqual(second);
  });

  it("changes when the seed changes", () => {
    const first = generatePattern(config);

    const second = generatePattern({
      ...config,
      seed: "different-seed",
    });

    expect(first.svg).not.toBe(second.svg);
  });

  it("supports different rendering dimensions", () => {
    const result = generatePattern({
      ...config,
      width: 1200,
      height: 630,
      borderRadius: 16,
    });

    expect(result.width).toBe(1200);
    expect(result.height).toBe(630);
    expect(result.svg).toContain('width="1200"');
    expect(result.svg).toContain('height="630"');
  });

  it("uses different gradient IDs for different seeds", () => {
    const first = generatePattern({
      ...config,
      seed: "seed-a",
    });

    const second = generatePattern({
      ...config,
      seed: "seed-b",
    });

    expect(first.svg).toContain('id="background-gradient-seed-a"');
    expect(second.svg).toContain('id="background-gradient-seed-b"');

    expect(first.svg).not.toContain('id="background-gradient-seed-b"');

    expect(second.svg).not.toContain('id="background-gradient-seed-a"');
  });
});

/*
Test coverage:

1. Generates an SVG image
   → Verifies the generated output contains a valid SVG, expected dimensions,
     definitions, a unique seed-based gradient, and pattern elements.

2. Produces deterministic output
   → Verifies the same configuration always produces exactly the same SVG.

3. Produces different output for different seeds
   → Verifies changing the seed results in a different generated SVG.

4. Supports different rendering dimensions
   → Verifies the generator correctly produces SVGs with custom width, height,
     and border radius values.
*/
