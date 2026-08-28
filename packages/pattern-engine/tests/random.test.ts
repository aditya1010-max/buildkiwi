import { describe, expect, it } from "vitest";
import { createSeededRandom } from "../src/core/random";

describe("createSeededRandom", () => {
  it("produces the same sequence for the same seed", () => {
    const first = createSeededRandom("test-seed");
    const second = createSeededRandom("test-seed");

    const firstSequence = [
      first.next(),
      first.next(),
      first.next(),
      first.next(),
    ];

    const secondSequence = [
      second.next(),
      second.next(),
      second.next(),
      second.next(),
    ];

    expect(firstSequence).toEqual(secondSequence);
  });

  it("produces different sequences for different seeds", () => {
    const first = createSeededRandom("seed-a");
    const second = createSeededRandom("seed-b");

    expect(first.next()).not.toBe(second.next());
  });

  it("generates integers within the requested range", () => {
    const random = createSeededRandom("integer-test");

    for (let index = 0; index < 100; index += 1) {
      const value = random.int(10, 20);

      expect(value).toBeGreaterThanOrEqual(10);
      expect(value).toBeLessThanOrEqual(20);
      expect(Number.isInteger(value)).toBe(true);
    }
  });

  it("picks an item from a collection", () => {
    const random = createSeededRandom("pick-test");
    const values = ["a", "b", "c"];

    for (let index = 0; index < 20; index += 1) {
      expect(values).toContain(random.pick(values));
    }
  });

  it("rejects an empty collection", () => {
    const random = createSeededRandom("empty-test");

    expect(() => random.pick([])).toThrow(
      "Cannot pick from an empty collection.",
    );
  });
});
