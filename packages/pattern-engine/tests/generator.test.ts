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
    expect(result.svg).toContain('id="background-gradient"');
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
});
