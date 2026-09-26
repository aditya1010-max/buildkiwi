import { describe, expect, it } from "vitest";

import {
  CreateProjectSchema,
  UpdateProjectSchema,
} from "../src/project.schema";

describe("CreateProjectSchema", () => {
  it("accepts valid project data", () => {
    const input = {
      title: "BuildKiwi",
      description: "A platform for developers to showcase projects.",
      tags: ["React", "TypeScript"],
      coverSeed: "buildkiwi-123",
      links: {
        github: "https://github.com/example/project",
        demo: "https://example.com",
      },
    };

    const result = CreateProjectSchema.safeParse(input);

    expect(result.success).toBe(true);
  });

  it("rejects a title shorter than 3 characters", () => {
    const input = {
      title: "AB",
      description: "A valid project description.",
      coverSeed: "buildkiwi-123",
    };

    const result = CreateProjectSchema.safeParse(input);

    expect(result.success).toBe(false);
  });

  it("accepts a title with exactly 3 characters", () => {
    const input = {
      title: "ABC",
      description: "A valid project description.",
      coverSeed: "buildkiwi-123",
    };

    const result = CreateProjectSchema.safeParse(input);

    expect(result.success).toBe(true);
  });

  it("rejects a description shorter than 10 characters", () => {
    const input = {
      title: "BuildKiwi",
      description: "Too short",
      coverSeed: "buildkiwi-123",
    };

    const result = CreateProjectSchema.safeParse(input);

    expect(result.success).toBe(false);
  });

  it("accepts a description with exactly 10 characters", () => {
    const input = {
      title: "BuildKiwi",
      description: "1234567890",
      coverSeed: "buildkiwi-123",
    };

    const result = CreateProjectSchema.safeParse(input);

    expect(result.success).toBe(true);
  });

  it("defaults tags to an empty array when omitted", () => {
    const input = {
      title: "BuildKiwi",
      description: "A valid project description.",
      coverSeed: "buildkiwi-123",
    };

    const result = CreateProjectSchema.safeParse(input);

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.tags).toEqual([]);
    }
  });

  it("accepts an array of string tags", () => {
    const input = {
      title: "BuildKiwi",
      description: "A valid project description.",
      tags: ["React", "Node.js", "MongoDB"],
      coverSeed: "buildkiwi-123",
    };

    const result = CreateProjectSchema.safeParse(input);

    expect(result.success).toBe(true);
  });

  it("rejects tags containing non-string values", () => {
    const input = {
      title: "BuildKiwi",
      description: "A valid project description.",
      tags: ["React", 123],
      coverSeed: "buildkiwi-123",
    };

    const result = CreateProjectSchema.safeParse(input);

    expect(result.success).toBe(false);
  });

  it("accepts a cover seed when provided", () => {
    const input = {
      title: "BuildKiwi",
      description: "A valid project description.",
      coverSeed: "buildkiwi-123",
    };

    const result = CreateProjectSchema.safeParse(input);

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.coverSeed).toBe("buildkiwi-123");
    }
  });

  it("rejects project data when cover seed is missing", () => {
    const input = {
      title: "BuildKiwi",
      description: "A valid project description.",
    };

    const result = CreateProjectSchema.safeParse(input);

    expect(result.success).toBe(false);
  });

  it("defaults links to an empty object when omitted", () => {
    const input = {
      title: "BuildKiwi",
      description: "A valid project description.",
      coverSeed: "buildkiwi-123",
    };

    const result = CreateProjectSchema.safeParse(input);

    expect(result.success).toBe(true);

    if (result.success) {
      expect(result.data.links).toEqual({});
    }
  });

  it("accepts valid GitHub and demo URLs", () => {
    const input = {
      title: "BuildKiwi",
      description: "A valid project description.",
      coverSeed: "buildkiwi-123",
      links: {
        github: "https://github.com/example/project",
        demo: "https://example.com",
      },
    };

    const result = CreateProjectSchema.safeParse(input);

    expect(result.success).toBe(true);
  });

  it("accepts empty GitHub and demo links", () => {
    const input = {
      title: "BuildKiwi",
      description: "A valid project description.",
      coverSeed: "buildkiwi-123",
      links: {
        github: "",
        demo: "",
      },
    };

    const result = CreateProjectSchema.safeParse(input);

    expect(result.success).toBe(true);
  });

  it("accepts omitted GitHub and demo links", () => {
    const input = {
      title: "BuildKiwi",
      description: "A valid project description.",
      coverSeed: "buildkiwi-123",
      links: {},
    };

    const result = CreateProjectSchema.safeParse(input);

    expect(result.success).toBe(true);
  });

  it("rejects an invalid GitHub URL", () => {
    const input = {
      title: "BuildKiwi",
      description: "A valid project description.",
      coverSeed: "buildkiwi-123",
      links: {
        github: "not-a-url",
      },
    };

    const result = CreateProjectSchema.safeParse(input);

    expect(result.success).toBe(false);
  });

  it("rejects an invalid demo URL", () => {
    const input = {
      title: "BuildKiwi",
      description: "A valid project description.",
      coverSeed: "buildkiwi-123",
      links: {
        demo: "not-a-url",
      },
    };

    const result = CreateProjectSchema.safeParse(input);

    expect(result.success).toBe(false);
  });

  it("rejects project data when title is missing", () => {
    const input = {
      description: "A valid project description.",
      coverSeed: "buildkiwi-123",
    };

    const result = CreateProjectSchema.safeParse(input);

    expect(result.success).toBe(false);
  });

  it("rejects project data when description is missing", () => {
    const input = {
      title: "BuildKiwi",
      coverSeed: "buildkiwi-123",
    };

    const result = CreateProjectSchema.safeParse(input);

    expect(result.success).toBe(false);
  });
});

describe("UpdateProjectSchema", () => {
  it("accepts a complete project update", () => {
    const input = {
      title: "Updated Project",
      description: "Updated project description.",
      tags: ["React", "TypeScript"],
      coverSeed: "updated-seed-123",
      links: {
        github: "https://github.com/example/project",
        demo: "https://example.com",
      },
    };

    const result = UpdateProjectSchema.safeParse(input);

    expect(result.success).toBe(true);
  });

  it("accepts an update containing only the title", () => {
    const input = {
      title: "Updated Project",
    };

    const result = UpdateProjectSchema.safeParse(input);

    expect(result.success).toBe(true);
  });

  it("accepts an update containing only the description", () => {
    const input = {
      description: "Updated project description.",
    };

    const result = UpdateProjectSchema.safeParse(input);

    expect(result.success).toBe(true);
  });

  it("accepts an empty update object", () => {
    const result = UpdateProjectSchema.safeParse({});

    expect(result.success).toBe(true);
  });

  it("still validates the title when it is provided", () => {
    const input = {
      title: "AB",
    };

    const result = UpdateProjectSchema.safeParse(input);

    expect(result.success).toBe(false);
  });

  it("still validates the description when it is provided", () => {
    const input = {
      description: "Too short",
    };

    const result = UpdateProjectSchema.safeParse(input);

    expect(result.success).toBe(false);
  });

  it("still validates URLs when links are provided", () => {
    const input = {
      links: {
        github: "not-a-url",
      },
    };

    const result = UpdateProjectSchema.safeParse(input);

    expect(result.success).toBe(false);
  });

  it("accepts an update containing only tags", () => {
    const input = {
      tags: ["React", "Node.js"],
    };

    const result = UpdateProjectSchema.safeParse(input);

    expect(result.success).toBe(true);
  });

  it("accepts an update containing only a cover seed", () => {
    const input = {
      coverSeed: "updated-seed-123",
    };

    const result = UpdateProjectSchema.safeParse(input);

    expect(result.success).toBe(true);
  });
});

/*
Test coverage:

CreateProjectSchema

1. Valid project data
   → Ensures a complete valid project passes validation.

2. Title shorter than 3 characters
   → Verifies the minimum title length rule.

3. Title with exactly 3 characters
   → Verifies the lower title boundary is valid.

4. Description shorter than 10 characters
   → Verifies the minimum description length rule.

5. Description with exactly 10 characters
   → Verifies the lower description boundary is valid.

6. Tags omitted
   → Verifies tags default to an empty array.

7. Valid string tags
   → Verifies tags accepts an array of strings.

8. Non-string tag
   → Verifies every tag must be a string.

9. Cover image provided
   → Verifies the optional coverImage field is accepted.

10. Cover image omitted
    → Verifies coverImage is optional.

11. Links omitted
    → Verifies links defaults to an empty object.

12. Valid GitHub and demo URLs
    → Verifies valid URLs are accepted.

13. Empty GitHub and demo URLs
    → Verifies empty strings are explicitly allowed.

14. Omitted GitHub and demo URLs
    → Verifies both individual link fields are optional.

15. Invalid GitHub URL
    → Verifies GitHub links must be valid URLs when provided.

16. Invalid demo URL
    → Verifies demo links must be valid URLs when provided.

17. Missing title
    → Verifies title is required when creating a project.

18. Missing description
    → Verifies description is required when creating a project.


UpdateProjectSchema

19. Complete project update
    → Verifies a complete update remains valid.

20. Title-only update
    → Verifies partial updates allow only the title.

21. Description-only update
    → Verifies partial updates allow only the description.

22. Empty update object
    → Verifies every field is optional for updates.

23. Invalid title in update
    → Verifies partial() does not remove the original title validation.

24. Invalid description in update
    → Verifies partial() does not remove the original description validation.

25. Invalid URL in update
    → Verifies nested link validation is still applied when links are provided.

26. Tags-only update
    → Verifies tags can be updated independently.

27. Cover image-only update
    → Verifies coverImage can be updated independently.
*/
