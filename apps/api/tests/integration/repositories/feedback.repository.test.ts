import { beforeEach, describe, expect, it, jest } from "@jest/globals";

import Feedback from "../../../src/models/feedback.model";

import { createFeedback } from "../../../src/repositories/feedback.repository";

jest.mock("../../../src/models/feedback.model", () => ({
  __esModule: true,
  default: {
    create: jest.fn(),
  },
}));

const mockCreate = jest.mocked(Feedback.create);

describe("feedback repository", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("creates feedback with the provided data", async () => {
    const data = {
      category: "bug" as const,
      title: "Broken button",
      description: "The submit button does not work.",
      page: "/projects/123",
      language: "en",
      userAgent: "Mozilla/5.0",
      userId: "user-123",
    };

    const feedback = {
      _id: "feedback-123",
      ...data,
    };

    mockCreate.mockResolvedValue(feedback as never);

    const result = await createFeedback(data);

    expect(mockCreate).toHaveBeenCalledWith(data);
    expect(result).toBe(feedback);
  });
});

/*
Test coverage:

1. Creates feedback with the provided data
   → Verifies the repository passes the complete feedback object to
     Feedback.create() and returns the created feedback.
*/
