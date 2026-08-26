import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import type { NextFunction, Request, Response } from "express";
import express from "express";
import request from "supertest";

type AuthenticatedRequest = Request & {
  user?: {
    userId: string;
    email: string;
  };
};

jest.mock("../../../src/middleware/auth.middleware", () => ({
  authMiddleware: (
    req: AuthenticatedRequest,
    _res: Response,
    next: NextFunction,
  ) => {
    req.user = {
      userId: "user-123",
      email: "aditya@example.com",
    };

    next();
  },
}));

import bookmarkRouter from "../../../src/routes/bookmark.routes";

import {
  addBookmarkService,
  removeBookmarkService,
  getBookmarksService,
} from "../../../src/services/bookmark.service";

import { errorHandler } from "../../../src/middleware/errorHandler";

jest.mock("../../../src/services/bookmark.service", () => ({
  addBookmarkService: jest.fn(),
  removeBookmarkService: jest.fn(),
  getBookmarksService: jest.fn(),
}));

const mockAddBookmark = jest.mocked(addBookmarkService);

const mockRemoveBookmark = jest.mocked(removeBookmarkService);

const mockGetBookmarks = jest.mocked(getBookmarksService);

const app = express();

app.use(express.json());
app.use("/bookmarks", bookmarkRouter);
app.use(errorHandler);

describe("bookmark HTTP", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /bookmarks/:projectId", () => {
    it("bookmarks a project successfully", async () => {
      mockAddBookmark.mockResolvedValue({
        _id: "bookmark-123",
        userId: "user-123",
        projectId: "project-123",
      } as never);

      const response = await request(app)
        .post("/bookmarks/project-123")
        .set("Authorization", "Bearer valid-access-token");

      expect(response.status).toBe(201);

      expect(response.body).toEqual({
        success: true,
        message: "Project bookmarked successfully.",
      });

      expect(mockAddBookmark).toHaveBeenCalledWith("user-123", "project-123");
    });

    it("returns an error when the project is not found", async () => {
      mockAddBookmark.mockRejectedValue(new Error("Project not found."));

      const response = await request(app)
        .post("/bookmarks/project-123")
        .set("Authorization", "Bearer valid-access-token");

      expect(response.status).toBe(500);

      expect(response.body).toEqual({
        success: false,
        message: "Project not found.",
      });
    });

    it("returns an error when the project is already bookmarked", async () => {
      mockAddBookmark.mockRejectedValue(
        new Error("Project already bookmarked."),
      );

      const response = await request(app)
        .post("/bookmarks/project-123")
        .set("Authorization", "Bearer valid-access-token");

      expect(response.status).toBe(500);

      expect(response.body).toEqual({
        success: false,
        message: "Project already bookmarked.",
      });
    });
  });

  describe("DELETE /bookmarks/:projectId", () => {
    it("removes a bookmark successfully", async () => {
      mockRemoveBookmark.mockResolvedValue({} as never);

      const response = await request(app)
        .delete("/bookmarks/project-123")
        .set("Authorization", "Bearer valid-access-token");

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        success: true,
        message: "Bookmark removed successfully.",
      });

      expect(mockRemoveBookmark).toHaveBeenCalledWith(
        expect.any(String),
        "project-123",
      );
    });

    it("returns an error when the bookmark does not exist", async () => {
      mockRemoveBookmark.mockRejectedValue(new Error("Bookmark not found."));

      const response = await request(app)
        .delete("/bookmarks/project-123")
        .set("Authorization", "Bearer valid-access-token");

      expect(response.status).toBe(500);

      expect(response.body).toEqual({
        success: false,
        message: "Bookmark not found.",
      });
    });
  });

  describe("GET /bookmarks", () => {
    it("returns the user's bookmarked projects", async () => {
      const projects = [
        {
          _id: "project-1",
          title: "BuildKiwi",
        },
        {
          _id: "project-2",
          title: "PulseChat",
        },
      ];

      mockGetBookmarks.mockResolvedValue(projects as never);

      const response = await request(app)
        .get("/bookmarks")
        .set("Authorization", "Bearer valid-access-token");

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        success: true,
        projects,
      });

      expect(mockGetBookmarks).toHaveBeenCalledWith(expect.any(String));
    });
  });
});

/*
Test coverage:

1. Adds a bookmark
   → Verifies an authenticated request reaches the controller,
     calls the bookmark service with the project ID, and returns 201.

2. Handles a missing project
   → Verifies a service error is returned to the HTTP client.

3. Handles a duplicate bookmark
   → Verifies an already-bookmarked project produces the expected
     error response.

4. Removes a bookmark
   → Verifies an authenticated request removes the requested project
     bookmark and returns 200.

5. Handles a missing bookmark
   → Verifies the service error reaches the HTTP response.

6. Gets bookmarked projects
   → Verifies the authenticated user's bookmarks are returned in
     the expected response structure.

*/
