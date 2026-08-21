import { describe, expect, it } from "vitest";

import { UpdateUserSchema } from "../src/user.schema";

describe("UpdateUserSchema", () => {
  it("accepts valid bio", () => {
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

  it("rejects a missing bio", () => {
    const result = UpdateUserSchema.safeParse({});

    expect(result.success).toBe(false);
  });

  it("rejects a non-string bio", () => {
    const input = {
      bio: 123,
    };

    const result = UpdateUserSchema.safeParse(input);

    expect(result.success).toBe(false);
  });

  /*
  Test coverage:

  1. Valid bio
     → Ensures valid user profile data is accepted.

  2. Whitespace trimming
     → Verifies surrounding whitespace is removed before the value is returned.

  3. Exactly 120 characters
     → Verifies the maximum allowed length is valid.

  4. More than 120 characters
     → Verifies bios exceeding the maximum length are rejected.

  5. Missing bio
     → Verifies bio is required when updating the user.

  6. Non-string bio
     → Verifies bio must be a string.
  */
});