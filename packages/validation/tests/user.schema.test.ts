import { describe, expect, it } from "vitest";

import { UpdateUserSchema } from "../src/user.schema";

describe("UpdateUserSchema", () => {
  it("accepts a valid bio", () => {
    const input = {
      bio: "Full-stack developer building products with React and Node.js.",
    };

    const result = UpdateUserSchema.safeParse(input);

    expect(result.success).toBe(true);
  });

  it("trims whitespace from the bio", () => {
    const input = {
      bio: "   Full-stack developer   ",
    };

    const result = UpdateUserSchema.safeParse(input);

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.bio).toBe("Full-stack developer");
    }
  });

  it("accepts a bio with exactly 120 characters", () => {
    const input = {
      bio: "a".repeat(120),
    };

    const result = UpdateUserSchema.safeParse(input);

    expect(result.success).toBe(true);
  });

  it("rejects a bio longer than 120 characters", () => {
    const input = {
      bio: "a".repeat(121),
    };

    const result = UpdateUserSchema.safeParse(input);

    expect(result.success).toBe(false);
  });

  it("rejects an empty update", () => {
    const result = UpdateUserSchema.safeParse({});

    expect(result.success).toBe(false);
  });

  it("accepts a valid avatar seed", () => {
    const input = {
      avatarSeed: "avatar-550e8400-e29b-41d4-a716-446655440000",
    };

    const result = UpdateUserSchema.safeParse(input);

    expect(result.success).toBe(true);
  });

  it("trims whitespace from the avatar seed", () => {
    const input = {
      avatarSeed: "   avatar-test-seed   ",
    };

    const result = UpdateUserSchema.safeParse(input);

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.avatarSeed).toBe("avatar-test-seed");
    }
  });

  it("rejects an empty avatar seed", () => {
    const input = {
      avatarSeed: "   ",
    };

    const result = UpdateUserSchema.safeParse(input);

    expect(result.success).toBe(false);
  });

  it("accepts a valid avatar pattern", () => {
    const input = {
      avatarPattern: "geometric",
    };

    const result = UpdateUserSchema.safeParse(input);

    expect(result.success).toBe(true);
  });

  it("rejects an invalid avatar pattern", () => {
    const input = {
      avatarPattern: "invalid-pattern",
    };

    const result = UpdateUserSchema.safeParse(input);

    expect(result.success).toBe(false);
  });

  it("accepts multiple profile fields together", () => {
    const input = {
      bio: "Full-stack developer",
      avatarSeed: "avatar-test-seed",
      avatarPattern: "waves",
    };

    const result = UpdateUserSchema.safeParse(input);

    expect(result.success).toBe(true);
  });

  it("rejects a non-string bio", () => {
    const input = {
      bio: 123,
    };

    const result = UpdateUserSchema.safeParse(input);

    expect(result.success).toBe(false);
  });
});

/*
  Test coverage:

  1. Valid bio
     → Ensures valid bio data is accepted.

  2. Whitespace trimming
     → Verifies surrounding whitespace is removed from the bio.

  3. Exactly 120 characters
     → Verifies the maximum allowed bio length is valid.

  4. More than 120 characters
     → Verifies bios exceeding the 120-character limit are rejected.

  5. Empty update
     → Verifies at least one profile field must be provided.

  6. Valid avatar seed
     → Ensures a non-empty avatar seed is accepted.

  7. Avatar seed trimming
     → Verifies surrounding whitespace is removed from the avatar seed.

  8. Empty avatar seed
     → Verifies an avatar seed containing only whitespace is rejected.

  9. Valid avatar pattern
     → Ensures a supported avatar pattern is accepted.

  10. Invalid avatar pattern
      → Verifies unsupported avatar patterns are rejected.

  11. Multiple profile fields
      → Verifies bio, avatar seed, and avatar pattern can be updated together.

  12. Non-string bio
      → Verifies bio must be a string.
  */
