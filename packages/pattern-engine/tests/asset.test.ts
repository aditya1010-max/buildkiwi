import { describe, expect, it } from "vitest";

import { generateAsset } from "../src/assets/generator";

describe("generateAsset", () => {
  it("produces identical SVG for the same asset request", () => {
    const request = {
      type: "cover" as const,
      seed: "deterministic-cover-seed",
    };

    const first = generateAsset(request);
    const second = generateAsset(request);

    expect(first.svg).toBe(second.svg);
  });

  it("produces identical profile SVG for the same asset request", () => {
    const request = {
      type: "profile" as const,
      seed: "deterministic-profile-seed",
    };

    const first = generateAsset(request);
    const second = generateAsset(request);

    expect(first.svg).toBe(second.svg);
  });

  it("produces different SVG for different seeds", () => {
    const first = generateAsset({
      type: "cover",
      seed: "seed-a",
    });

    const second = generateAsset({
      type: "cover",
      seed: "seed-b",
    });

    expect(first.svg).not.toBe(second.svg);
  });
});
