import { beforeEach, describe, expect, it, jest } from "@jest/globals";

import { createFeedback } from "../../../src/repositories/feedback.repository";

import { submitFeedback } from "../../../src/services/feedback.service";

jest.mock("../../../src/repositories/feedback.repository", () => ({
  createFeedback: jest.fn(),
}));

const mockCreateFeedback = jest.mocked(createFeedback);

describe("feedback service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("submits feedback with trimmed title and description", async () => {
    const feedback = {
      _id: "feedback-123",
      category: "bug",
      title: "Login issue",
      description: "Unable to log in.",
    };

    mockCreateFeedback.mockResolvedValue(feedback as never);

    const result = await submitFeedback({
      category: "bug",
      title: "  Login issue  ",
      description: "  Unable to log in.  ",
      page: "/login",
      language: "en",
      userAgent: "Mozilla/5.0",
      userId: "user-123",
    });

    expect(mockCreateFeedback).toHaveBeenCalledWith({
      category: "bug",
      title: "Login issue",
      description: "Unable to log in.",
      page: "/login",
      language: "en",
      userAgent: "Mozilla/5.0",
      userId: "user-123",
    });

    expect(result).toBe(feedback);
  });

  it("rejects feedback with an empty title", async () => {
    await expect(
      submitFeedback({
        category: "bug",
        title: "   ",
        description: "Something is broken.",
        page: "/login",
        language: "en",
        userAgent: "Mozilla/5.0",
        userId: null,
      }),
    ).rejects.toThrow("Title is required.");

    expect(mockCreateFeedback).not.toHaveBeenCalled();
  });

  it("rejects feedback with an empty description", async () => {
    await expect(
      submitFeedback({
        category: "general",
        title: "Feedback",
        description: "   ",
        page: "/",
        language: "en",
        userAgent: "Mozilla/5.0",
        userId: null,
      }),
    ).rejects.toThrow("Description is required.");

    expect(mockCreateFeedback).not.toHaveBeenCalled();
  });
});

/*
Test coverage:

1. Submits feedback with trimmed title and description
   → Verifies valid feedback is passed to the repository and that
     surrounding whitespace is removed from the title and description.

2. Rejects feedback with an empty title
   → Verifies whitespace-only titles are rejected before the repository
     is called.

3. Rejects feedback with an empty description
   → Verifies whitespace-only descriptions are rejected before the
     repository is called.
*/
