import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import express from "express";
import request from "supertest";

import feedbackRouter from "../../../src/routes/feedback.routes";
import { errorHandler } from "../../../src/middleware/errorHandler";
import { submitFeedback } from "../../../src/services/feedback.service";
import { AppError } from "../../../src/utils/AppError";

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

    it("returns a validation error when the title is missing", async () => {
      mockSubmitFeedback.mockRejectedValue(
        new AppError("Title is required.", 400),
      );

      const response = await request(app).post("/feedback").send({
        category: "bug",
        title: "",
        description: "Something is broken.",
        page: "/projects",
        language: "en",
        userAgent: "test-agent",
      });

      expect(response.status).toBe(400);

      expect(response.body).toEqual({
        success: false,
        message: "Title is required.",
      });
    });

    it("hides unexpected feedback submission errors", async () => {
      mockSubmitFeedback.mockRejectedValue(
        new Error("Unexpected database failure"),
      );

      const response = await request(app).post("/feedback").send({
        category: "bug",
        title: "Broken button",
        description: "Something is broken.",
        page: "/projects",
        language: "en",
        userAgent: "test-agent",
      });

      expect(response.status).toBe(500);

      expect(response.body).toEqual({
        success: false,
        message: "Internal Server Error",
      });
    });
  });
});

/*
Test coverage:

1. Bug feedback submission
   -> Verifies successful submission returns HTTP 201 and the feedback.

2. Feature feedback submission
   -> Verifies feature requests are accepted and passed to the service.

3. Missing title
   -> Verifies an AppError validation failure returns HTTP 400.

4. Unexpected service failure
   -> Verifies internal errors return a generic HTTP 500 response.
*/
