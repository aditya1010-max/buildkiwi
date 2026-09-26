/**
 * Test Scope
 * ----------
 * Handles asset generation, preset lookup, and asset request resolution.
 *
 * Covers:
 * - Asset preset registration
 * - Asset preset lookup
 * - Asset request resolution
 * - Pattern overrides
 * - Asset generation
 * - Asset dimensions
 *
 * Does not cover:
 * - Core pattern generation
 * - Pattern implementation details
 * - Theme resolution
 * - Visual budget rules
 * - SVG serialization
 */

import { describe, expect, it } from "vitest";

import {
  generateAsset,
  getAssetPreset,
  resolveAssetRequest,
} from "../src/assets";

describe("assets", () => {
  describe("presets", () => {
    it("returns the cover preset", () => {
      expect(getAssetPreset("cover")).toEqual({
        type: "cover",
        width: 1200,
        height: 630,
        pattern: "geometric",
      });
    });

    it("returns the profile preset", () => {
      expect(getAssetPreset("profile")).toEqual({
        type: "profile",
        width: 512,
        height: 512,
        pattern: "geometric",
      });
    });
  });

  describe("resolveAssetRequest", () => {
    it("resolves a cover request using its preset", () => {
      const config = resolveAssetRequest({
        type: "cover",
        seed: "test-seed",
      });

      expect(config).toEqual({
        seed: "test-seed",
        pattern: "geometric",
        width: 1200,
        height: 630,
      });
    });

    it("resolves a profile request using its preset", () => {
      const config = resolveAssetRequest({
        type: "profile",
        seed: "test-seed",
      });

      expect(config).toEqual({
        seed: "test-seed",
        pattern: "geometric",
        width: 512,
        height: 512,
      });
    });

    it("allows the requested pattern to override the preset pattern", () => {
      const config = resolveAssetRequest({
        type: "cover",
        seed: "test-seed",
        pattern: "blobs",
      });

      expect(config.pattern).toBe("blobs");
      expect(config.width).toBe(1200);
      expect(config.height).toBe(630);
    });
  });

  describe("generateAsset", () => {
    it("generates a cover with the preset dimensions", () => {
      const result = generateAsset({
        type: "cover",
        seed: "test-seed",
      });

      expect(result.width).toBe(1200);
      expect(result.height).toBe(630);
      expect(result.svg).toContain("<svg");
    });

    it("generates a profile with the preset dimensions", () => {
      const result = generateAsset({
        type: "profile",
        seed: "test-seed",
      });

      expect(result.width).toBe(512);
      expect(result.height).toBe(512);
      expect(result.svg).toContain("<svg");
    });

    it("produces deterministic output for the same request", () => {
      const first = generateAsset({
        type: "cover",
        seed: "same-seed",
      });

      const second = generateAsset({
        type: "cover",
        seed: "same-seed",
      });

      expect(first).toEqual(second);
    });
  });
});
