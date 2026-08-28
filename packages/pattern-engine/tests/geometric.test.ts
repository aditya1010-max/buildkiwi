import { describe, expect, it } from "vitest";
import { geometricPattern } from "../src/patterns/geometric";
import { createSeededRandom } from "../src/core/random";

const createContext = (seed: string) => ({
  width: 512,
  height: 512,
  borderRadius: 999,
  palette: ["#111111", "#555555", "#999999"],
  random: createSeededRandom(seed),
});

describe("geometricPattern", () => {
  it("has the correct pattern id", () => {
    expect(geometricPattern.id).toBe("geometric");
  });

  it("generates the expected number of elements", () => {
    const output = geometricPattern.generate(
      createContext("test-seed"),
    );

    expect(output.elements).toHaveLength(12);
  });

  it("produces deterministic output", () => {
    const first = geometricPattern.generate(
      createContext("test-seed"),
    );

    const second = geometricPattern.generate(
      createContext("test-seed"),
    );

    expect(first).toEqual(second);
  });

  it("produces different output for different seeds", () => {
    const first = geometricPattern.generate(
      createContext("seed-a"),
    );

    const second = geometricPattern.generate(
      createContext("seed-b"),
    );

    expect(first).not.toEqual(second);
  });

  it("keeps generated geometry inside the canvas", () => {
    const output = geometricPattern.generate(
      createContext("bounds-test"),
    );

    for (const element of output.elements) {
      if (element.type === "circle") {
        expect(element.cx - element.radius).toBeGreaterThanOrEqual(0);
        expect(element.cy - element.radius).toBeGreaterThanOrEqual(0);
        expect(element.cx + element.radius).toBeLessThanOrEqual(512);
        expect(element.cy + element.radius).toBeLessThanOrEqual(512);
      }

      if (element.type === "rectangle") {
        expect(element.x).toBeGreaterThanOrEqual(0);
        expect(element.y).toBeGreaterThanOrEqual(0);
        expect(element.x + element.width).toBeLessThanOrEqual(512);
        expect(element.y + element.height).toBeLessThanOrEqual(512);
      }
    }
  });
});
