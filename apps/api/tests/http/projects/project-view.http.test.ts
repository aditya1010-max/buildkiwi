import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import express from "express";
import request from "supertest";

import projectRouter from "../../../src/routes/project.routes";

import { recordProjectView } from "../../../src/services/projectView.service";
import { errorHandler } from "../../../src/middleware/errorHandler";
import { AppError } from "../../../src/utils/AppError";

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

    it("returns 404 when the project does not exist", async () => {
      mockRecordProjectView.mockRejectedValue(
        new AppError("Project not found.", 404),
      );

      const response = await request(app)
        .post("/projects/project-123/view")
        .set("X-Visitor-Id", "visitor-123");

      expect(response.status).toBe(404);

      expect(response.body).toEqual({
        success: false,
        message: "Project not found.",
      });

      expect(mockRecordProjectView).toHaveBeenCalledWith(
        "project-123",
        "visitor-123",
      );
    });

    it("handles unexpected errors from the view service", async () => {
      mockRecordProjectView.mockRejectedValue(
        new Error("Failed to record project view"),
      );

      const response = await request(app)
        .post("/projects/project-123/view")
        .set("X-Visitor-Id", "visitor-123");

      expect(response.status).toBe(500);

      expect(response.body).toEqual({
        success: false,
        message: "Internal Server Error",
      });

      expect(mockRecordProjectView).toHaveBeenCalledWith(
        "project-123",
        "visitor-123",
      );
    });
  });
});

/*
Test coverage:

1. Records a project view successfully.
   -> Verifies the endpoint returns HTTP 200.
   -> Verifies the project ID and visitor ID reach the service.

2. Rejects a missing visitor ID.
   -> Verifies the endpoint returns HTTP 400.
   -> Verifies the service is not called.

3. Handles a missing project.
   -> Verifies AppError returns HTTP 404.
   -> Verifies the expected error message is preserved.

4. Handles unexpected service failures.
   -> Verifies ordinary errors return HTTP 500.
   -> Verifies internal error messages are not exposed.
*/
