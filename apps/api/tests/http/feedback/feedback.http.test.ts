import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import express from "express";
import request from "supertest";

import feedbackRouter from "../../../src/routes/feedback.routes";
import { errorHandler } from "../../../src/middleware/errorHandler";

import { submitFeedback } from "../../../src/services/feedback.service";

jest.mock("../../../src/services/feedback.service", () => ({
  submitFeedback: jest.fn(),
}));

const mockSubmitFeedback = jest.mocked(submitFeedback);

const app = express();

app.use(express.json());
app.use("/feedback", feedbackRouter);
app.use(errorHandler);

describe("feedback HTTP", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /feedback", () => {
    it("submits feedback successfully", async () => {
      const feedback = {
        _id: "feedback-123",
        category: "bug",
        title: "Broken button",
        description: "The submit button does not work.",
        page: "/projects",
        language: "en",
        userAgent: "test-agent",
        userId: null,
      };

      mockSubmitFeedback.mockResolvedValue(feedback as never);

      const response = await request(app).post("/feedback").send({
        category: "bug",
        title: "Broken button",
        description: "The submit button does not work.",
        page: "/projects",
        language: "en",
        userAgent: "test-agent",
      });

      expect(response.status).toBe(201);

      expect(response.body).toEqual({
        success: true,
        message: "Feedback submitted successfully.",
        data: feedback,
      });

      expect(mockSubmitFeedback).toHaveBeenCalledWith({
        category: "bug",
        title: "Broken button",
        description: "The submit button does not work.",
        page: "/projects",
        language: "en",
        userAgent: "test-agent",
        userId: null,
      });
    });

    it("supports feature feedback", async () => {
      const feedback = {
        _id: "feedback-123",
        category: "feature",
        title: "Add dark mode",
        description: "A dark mode would be useful.",
        page: "/",
        language: "en",
        userAgent: "test-agent",
        userId: null,
      };

      mockSubmitFeedback.mockResolvedValue(feedback as never);

      const response = await request(app).post("/feedback").send({
        category: "feature",
        title: "Add dark mode",
        description: "A dark mode would be useful.",
        page: "/",
        language: "en",
        userAgent: "test-agent",
      });

      expect(response.status).toBe(201);

      expect(response.body).toEqual({
        success: true,
        message: "Feedback submitted successfully.",
        data: feedback,
      });

      expect(mockSubmitFeedback).toHaveBeenCalledWith(
        expect.objectContaining({
          category: "feature",
          title: "Add dark mode",
        }),
      );
    });

    it("returns an error when feedback submission fails", async () => {
      mockSubmitFeedback.mockRejectedValue(new Error("Title is required."));

      const response = await request(app).post("/feedback").send({
        category: "bug",
        title: "",
        description: "Something is broken.",
        page: "/projects",
        language: "en",
        userAgent: "test-agent",
      });

      expect(response.status).toBe(500);

      expect(response.body).toEqual({
        success: false,
        message: "Title is required.",
      });
    });
  });
});

/*
Test coverage:

1. Submits feedback
   → Verifies the endpoint passes the feedback data to the service
     and returns the created feedback with HTTP 201.

2. Supports feature feedback
   → Verifies another valid feedback category is accepted and
     passed through to the service.

3. Handles feedback validation errors
   → Verifies a service error reaches the HTTP error response.
*/
