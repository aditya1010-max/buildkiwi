import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import express from "express";
import request from "supertest";

import projectRouter from "../../../src/routes/project.routes";

import { recordProjectView } from "../../../src/services/projectView.service";
import { errorHandler } from "../../../src/middleware/errorHandler";

jest.mock("../../../src/services/projectView.service", () => ({
  recordProjectView: jest.fn(),
}));

const mockRecordProjectView = jest.mocked(recordProjectView);

const app = express();

app.use(express.json());
app.use("/projects", projectRouter);
app.use(errorHandler);

describe("project view HTTP", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /projects/:id/view", () => {
    it("records a project view successfully", async () => {
      mockRecordProjectView.mockResolvedValue(undefined);

      const response = await request(app)
        .post("/projects/project-123/view")
        .set("X-Visitor-Id", "visitor-123");

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        success: true,
      });

      expect(mockRecordProjectView).toHaveBeenCalledWith(
        "project-123",
        "visitor-123",
      );
    });

    it("rejects a request without a visitor ID", async () => {
      const response = await request(app).post("/projects/project-123/view");

      expect(response.status).toBe(400);

      expect(response.body).toEqual({
        success: false,
        message: "Visitor ID is required.",
      });

      expect(mockRecordProjectView).not.toHaveBeenCalled();
    });

    it("handles errors from the view service", async () => {
      mockRecordProjectView.mockRejectedValue(
        new Error("Failed to record project view"),
      );

      const response = await request(app)
        .post("/projects/project-123/view")
        .set("X-Visitor-Id", "visitor-123");

      expect(response.status).toBe(500);

      expect(response.body).toEqual({
        success: false,
        message: "Failed to record project view",
      });
    });
  });
});

/*
Test coverage:

1. Records a project view
   → Verifies the visitor ID middleware, project ID, visitor ID,
     service call, and successful HTTP response.

2. Rejects a missing visitor ID
   → Verifies visitorMiddleware blocks the request before the
     project view service is called.

3. Handles service errors
   → Verifies errors from recordProjectView reach the HTTP error
     handler.
*/
