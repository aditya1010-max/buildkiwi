import { describe, expect, it } from "vitest";

import {
  CreateCommentSchema,
  UpdateCommentSchema,
} from "../src/comment.schema";

describe("CreateCommentSchema", () => {
  it("accepts valid comment data", () => {
    const input = {
      projectId: "project-123",
      content: "This is a great project!",
    };

    const result = CreateCommentSchema.safeParse(input);

    expect(result.success).toBe(true);
  });

  it("rejects an empty comment", () => {
    const input = {
      projectId: "project-123",
      content: "",
    };

    const result = CreateCommentSchema.safeParse(input);

    expect(result.success).toBe(false);
  });

  it("rejects a comment longer than 1000 characters", () => {
    const input = {
      projectId: "project-123",
      content: "a".repeat(1001),
    };

    const result = CreateCommentSchema.safeParse(input);

    expect(result.success).toBe(false);
  });

  it("accepts a comment with exactly 1 character", () => {
    const input = {
      projectId: "project-123",
      content: "a",
    };

    const result = CreateCommentSchema.safeParse(input);

    expect(result.success).toBe(true);
  });

  it("accepts a comment with exactly 1000 characters", () => {
    const input = {
      projectId: "project-123",
      content: "a".repeat(1000),
    };

    const result = CreateCommentSchema.safeParse(input);

    expect(result.success).toBe(true);
  });

  it("rejects comment data when projectId is missing", () => {
    const input = {
      content: "This is a comment.",
    };

    const result = CreateCommentSchema.safeParse(input);

    expect(result.success).toBe(false);
  });

  it("rejects comment data when content is missing", () => {
    const input = {
      projectId: "project-123",
    };

    const result = CreateCommentSchema.safeParse(input);

    expect(result.success).toBe(false);
  });

  it("rejects a non-string projectId", () => {
    const input = {
      projectId: 123,
      content: "This is a comment.",
    };

    const result = CreateCommentSchema.safeParse(input);

    expect(result.success).toBe(false);
  });

  it("rejects non-string comment content", () => {
    const input = {
      projectId: "project-123",
      content: 123,
    };

    const result = CreateCommentSchema.safeParse(input);

    expect(result.success).toBe(false);
  });
});

describe("UpdateCommentSchema", () => {
  it("accepts valid comment content", () => {
    const input = {
      content: "Updated comment content.",
    };

    const result = UpdateCommentSchema.safeParse(input);

    expect(result.success).toBe(true);
  });

  it("rejects an empty comment", () => {
    const input = {
      content: "",
    };

    const result = UpdateCommentSchema.safeParse(input);

    expect(result.success).toBe(false);
  });

  it("rejects a comment longer than 1000 characters", () => {
    const input = {
      content: "a".repeat(1001),
    };

    const result = UpdateCommentSchema.safeParse(input);

    expect(result.success).toBe(false);
  });

  it("accepts a comment with exactly 1 character", () => {
    const input = {
      content: "a",
    };

    const result = UpdateCommentSchema.safeParse(input);

    expect(result.success).toBe(true);
  });

  it("accepts a comment with exactly 1000 characters", () => {
    const input = {
      content: "a".repeat(1000),
    };

    const result = UpdateCommentSchema.safeParse(input);

    expect(result.success).toBe(true);
  });

  it("rejects update data when content is missing", () => {
    const input = {};

    const result = UpdateCommentSchema.safeParse(input);

    expect(result.success).toBe(false);
  });

  it("rejects non-string comment content", () => {
    const input = {
      content: 123,
    };

    const result = UpdateCommentSchema.safeParse(input);

    expect(result.success).toBe(false);
  });
});

/*
Test coverage:

CreateCommentSchema
1. Valid comment data
   → Ensures a correctly structured comment creation request is accepted.

2. Empty comment
   → Verifies the minimum content length of 1 character.

3. Comment longer than 1000 characters
   → Verifies the maximum content length of 1000 characters.

4. Exactly 1 character
   → Verifies the lower boundary is valid.

5. Exactly 1000 characters
   → Verifies the upper boundary is valid.

6. Missing projectId
   → Verifies that projectId is required when creating a comment.

7. Missing content
   → Verifies that content is required when creating a comment.

8. Non-string projectId
   → Verifies that projectId must be a string.

9. Non-string content
   → Verifies that comment content must be a string.

UpdateCommentSchema
10. Valid comment content
    → Ensures valid update data is accepted.

11. Empty comment
    → Verifies the minimum content length of 1 character.

12. Comment longer than 1000 characters
    → Verifies the maximum content length of 1000 characters.

13. Exactly 1 character
    → Verifies the lower boundary is valid.

14. Exactly 1000 characters
    → Verifies the upper boundary is valid.

15. Missing content
    → Verifies that content is required when updating a comment.

16. Non-string content
    → Verifies that comment content must be a string.
*/
