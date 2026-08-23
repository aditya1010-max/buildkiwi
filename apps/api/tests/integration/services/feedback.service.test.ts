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

  describe("submitFeedback", () => {
    it("submits valid feedback with trimmed title and description", async () => {
      const feedback = {
        _id: "feedback-123",
        category: "bug",
        title: "Bug report",
        description: "Something is not working",
      };

      mockCreateFeedback.mockResolvedValue(feedback as never);

      const result = await submitFeedback({
        category: "bug",
        title: "  Bug report  ",
        description: "  Something is not working  ",
        page: "/projects",
        language: "en",
        userAgent: "test-agent",
        userId: "user-123",
      });

      expect(mockCreateFeedback).toHaveBeenCalledWith({
        category: "bug",
        title: "Bug report",
        description: "Something is not working",
        page: "/projects",
        language: "en",
        userAgent: "test-agent",
        userId: "user-123",
      });

      expect(result).toBe(feedback);
    });

    it("rejects feedback with an empty title", async () => {
      await expect(
        submitFeedback({
          category: "bug",
          title: "   ",
          description: "Something is wrong",
          page: "/projects",
          language: "en",
          userAgent: "test-agent",
        }),
      ).rejects.toThrow("Title is required.");

      expect(mockCreateFeedback).not.toHaveBeenCalled();
    });

    it("rejects feedback with an empty description", async () => {
      await expect(
        submitFeedback({
          category: "bug",
          title: "Bug report",
          description: "   ",
          page: "/projects",
          language: "en",
          userAgent: "test-agent",
        }),
      ).rejects.toThrow("Description is required.");

      expect(mockCreateFeedback).not.toHaveBeenCalled();
    });
  });
});

/*
Test coverage:

1. Submits valid feedback
   → Verifies valid feedback is passed to the repository and that
     leading/trailing whitespace is removed from the title and
     description.

2. Rejects an empty title
   → Verifies whitespace-only titles are rejected and the repository
     is not called.

3. Rejects an empty description
   → Verifies whitespace-only descriptions are rejected and the
     repository is not called.
*/
