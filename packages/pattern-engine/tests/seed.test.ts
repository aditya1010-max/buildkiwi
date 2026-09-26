/**
 * Test Scope
 * ----------
 * Handles seed hashing and seed-related utilities.
 *
 * Covers:
 * - Deterministic seed hashing
 * - Different seeds producing different hashes
 * - Empty seeds
 * - Unicode seeds
 * - Numeric hash output
 * - Unsigned 32-bit hash values
 *
 * Does not cover:
 * - Random sequence behavior
 * - Integer generation
 * - Random selection
 * - Pattern generation
 */

import { describe, expect, it } from "vitest";

import { hashSeed } from "../src/core/seed";

describe("hashSeed", () => {
  it("produces a deterministic hash for the same seed", () => {
    const first = hashSeed("test-seed");
    const second = hashSeed("test-seed");

    expect(first).toBe(second);
  });

  it("produces different hashes for different seeds", () => {
    const first = hashSeed("seed-a");
    const second = hashSeed("seed-b");

    expect(first).not.toBe(second);
  });

  it("returns a number", () => {
    const result = hashSeed("test-seed");

    expect(typeof result).toBe("number");
  });

  it("returns an unsigned 32-bit integer", () => {
    const result = hashSeed("test-seed");

    expect(Number.isInteger(result)).toBe(true);
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThanOrEqual(0xffffffff);
  });

  it("handles an empty seed", () => {
    const result = hashSeed("");

    expect(typeof result).toBe("number");
    expect(Number.isInteger(result)).toBe(true);
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThanOrEqual(0xffffffff);
  });

  it("handles unicode seeds", () => {
    const first = hashSeed("こんにちは");
    const second = hashSeed("こんにちは");

    expect(first).toBe(second);
  });

  it("distinguishes unicode seeds with different content", () => {
    const first = hashSeed("こんにちは");
    const second = hashSeed("こんばんは");

    expect(first).not.toBe(second);
  });
});
