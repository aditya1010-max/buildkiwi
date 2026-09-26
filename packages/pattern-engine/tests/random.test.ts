/**
 * Test Scope
 * ----------
 * Handles deterministic seeded-random utilities.
 *
 * Covers:
 * - Seeded random sequences
 * - Deterministic output
 * - Numeric ranges
 * - Integer generation
 * - Random selection helpers
 * - Invalid random integer bounds
 * - Empty collection handling
 *
 * Does not cover:
 * - Seed normalization
 * - Pattern generation
 * - Layout algorithms
 * - SVG serialization
 */

import { describe, expect, it } from "vitest";

import { createSeededRandom } from "../src/core/random";

describe("createSeededRandom", () => {
  describe("next", () => {
    it("produces deterministic values for the same seed", () => {
      const first = createSeededRandom("test-seed");
      const second = createSeededRandom("test-seed");

      const firstSequence = [
        first.next(),
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
        second.next(),
      ];

      expect(firstSequence).toEqual(secondSequence);
    });

    it("produces different sequences for different seeds", () => {
      const first = createSeededRandom("seed-a");
      const second = createSeededRandom("seed-b");

      const firstSequence = [first.next(), first.next(), first.next()];

      const secondSequence = [second.next(), second.next(), second.next()];

      expect(firstSequence).not.toEqual(secondSequence);
    });

    it("produces values within the range [0, 1)", () => {
      const random = createSeededRandom("range-test");

      for (let index = 0; index < 100; index += 1) {
        const value = random.next();

        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThan(1);
      }
    });

    it("produces the same sequence when recreated with the same seed", () => {
      const random = createSeededRandom("repeatable");

      const firstValue = random.next();
      const secondValue = random.next();

      const recreated = createSeededRandom("repeatable");

      expect(recreated.next()).toBe(firstValue);
      expect(recreated.next()).toBe(secondValue);
    });
  });

  describe("int", () => {
    it("produces integers within the inclusive range", () => {
      const random = createSeededRandom("integer-range");

      for (let index = 0; index < 100; index += 1) {
        const value = random.int(5, 10);

        expect(Number.isInteger(value)).toBe(true);
        expect(value).toBeGreaterThanOrEqual(5);
        expect(value).toBeLessThanOrEqual(10);
      }
    });

    it("supports a single-value range", () => {
      const random = createSeededRandom("single-value");

      for (let index = 0; index < 10; index += 1) {
        expect(random.int(7, 7)).toBe(7);
      }
    });

    it("produces deterministic integers for the same seed", () => {
      const first = createSeededRandom("integer-seed");
      const second = createSeededRandom("integer-seed");

      const firstSequence = [
        first.int(1, 100),
        first.int(1, 100),
        first.int(1, 100),
      ];

      const secondSequence = [
        second.int(1, 100),
        second.int(1, 100),
        second.int(1, 100),
      ];

      expect(firstSequence).toEqual(secondSequence);
    });

    it("throws when the minimum is not an integer", () => {
      const random = createSeededRandom("invalid-min");

      expect(() => random.int(1.5, 10)).toThrow(
        "Random integer bounds must be integers.",
      );
    });

    it("throws when the maximum is not an integer", () => {
      const random = createSeededRandom("invalid-max");

      expect(() => random.int(1, 10.5)).toThrow(
        "Random integer bounds must be integers.",
      );
    });

    it("throws when the minimum exceeds the maximum", () => {
      const random = createSeededRandom("invalid-range");

      expect(() => random.int(10, 1)).toThrow(
        "Random integer minimum cannot exceed maximum.",
      );
    });
  });

  describe("pick", () => {
    it("returns an item from the provided collection", () => {
      const random = createSeededRandom("pick-test");
      const items = ["a", "b", "c", "d"];

      const result = random.pick(items);

      expect(items).toContain(result);
    });

    it("produces deterministic selections for the same seed", () => {
      const first = createSeededRandom("pick-seed");
      const second = createSeededRandom("pick-seed");

      const items = ["a", "b", "c", "d", "e"];

      const firstSequence = [
        first.pick(items),
        first.pick(items),
        first.pick(items),
      ];

      const secondSequence = [
        second.pick(items),
        second.pick(items),
        second.pick(items),
      ];

      expect(firstSequence).toEqual(secondSequence);
    });

    it("supports readonly collections", () => {
      const random = createSeededRandom("readonly");

      const items = ["a", "b", "c"] as const;

      expect(items).toContain(random.pick(items));
    });

    it("throws when picking from an empty collection", () => {
      const random = createSeededRandom("empty");

      expect(() => random.pick([])).toThrow(
        "Cannot pick from an empty collection.",
      );
    });
  });
});
