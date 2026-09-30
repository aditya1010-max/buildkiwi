import { describe, expect, it } from "vitest";

import { CreateCommentSchema } from "../src/comment.schema";

describe("CreateCommentSchema", () => {
  it("accepts valid comment data", () => {
    const input = {
      content: "This is a great project!",
    };

    const result = CreateCommentSchema.safeParse(input);

    expect(result.success).toBe(true);
  });

  it("rejects an empty comment", () => {
    const input = {
      content: "",
    };

    const result = CreateCommentSchema.safeParse(input);

    expect(result.success).toBe(false);
  });

  it("rejects a whitespace-only comment", () => {
    const input = {
      content: "   ",
    };

    const result = CreateCommentSchema.safeParse(input);

    expect(result.success).toBe(false);
  });

  it("rejects a comment longer than 500 characters", () => {
    const input = {
      content: "a".repeat(501),
    };

    const result = CreateCommentSchema.safeParse(input);

    expect(result.success).toBe(false);
  });

  it("accepts a comment with exactly 1 character", () => {
    const input = {
      content: "a",
    };

    const result = CreateCommentSchema.safeParse(input);

    expect(result.success).toBe(true);
  });

  it("accepts a comment with exactly 500 characters", () => {
    const input = {
      content: "a".repeat(500),
    };

    const result = CreateCommentSchema.safeParse(input);

    expect(result.success).toBe(true);
  });

  it("rejects comment data when content is missing", () => {
    const input = {};

    const result = CreateCommentSchema.safeParse(input);

    expect(result.success).toBe(false);
  });

  it("rejects non-string comment content", () => {
    const input = {
      content: 123,
    };

    const result = CreateCommentSchema.safeParse(input);

    expect(result.success).toBe(false);
  });

  it("trims surrounding whitespace", () => {
    const input = {
      content: "  Nice project!  ",
    };

    const result = CreateCommentSchema.safeParse(input);

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.content).toBe("Nice project!");
    }
  });
});
