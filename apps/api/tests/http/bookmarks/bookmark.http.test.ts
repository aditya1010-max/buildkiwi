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
import { AppError } from "../../../src/utils/AppError";

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

    it("returns 404 when the project is not found", async () => {
      mockAddBookmark.mockRejectedValue(
        new AppError("Project not found.", 404),
      );

      const response = await request(app)
        .post("/bookmarks/project-123")
        .set("Authorization", "Bearer valid-access-token");

      expect(response.status).toBe(404);

      expect(response.body).toEqual({
        success: false,
        message: "Project not found.",
      });
    });

    it("returns 409 when the project is already bookmarked", async () => {
      mockAddBookmark.mockRejectedValue(
        new AppError("Project already bookmarked.", 409),
      );

      const response = await request(app)
        .post("/bookmarks/project-123")
        .set("Authorization", "Bearer valid-access-token");

      expect(response.status).toBe(409);

      expect(response.body).toEqual({
        success: false,
        message: "Project already bookmarked.",
      });
    });

    it("hides unexpected errors when adding a bookmark fails", async () => {
      mockAddBookmark.mockRejectedValue(
        new Error("Unexpected database failure"),
      );

      const response = await request(app)
        .post("/bookmarks/project-123")
        .set("Authorization", "Bearer valid-access-token");

      expect(response.status).toBe(500);

      expect(response.body).toEqual({
        success: false,
        message: "Internal Server Error",
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
        "user-123",
        "project-123",
      );
    });

    it("returns 404 when the bookmark does not exist", async () => {
      mockRemoveBookmark.mockRejectedValue(
        new AppError("Bookmark not found.", 404),
      );

      const response = await request(app)
        .delete("/bookmarks/project-123")
        .set("Authorization", "Bearer valid-access-token");

      expect(response.status).toBe(404);

      expect(response.body).toEqual({
        success: false,
        message: "Bookmark not found.",
      });
    });

    it("hides unexpected errors when removing a bookmark fails", async () => {
      mockRemoveBookmark.mockRejectedValue(
        new Error("Unexpected database failure"),
      );

      const response = await request(app)
        .delete("/bookmarks/project-123")
        .set("Authorization", "Bearer valid-access-token");

      expect(response.status).toBe(500);

      expect(response.body).toEqual({
        success: false,
        message: "Internal Server Error",
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

      expect(mockGetBookmarks).toHaveBeenCalledWith("user-123");
    });
  });
});

/*
Test coverage:

1. Adds a bookmark successfully.
2. Returns HTTP 404 when the project does not exist.
3. Returns HTTP 409 when the project is already bookmarked.
4. Hides unexpected errors during bookmark creation.
5. Removes a bookmark successfully.
6. Returns HTTP 404 when the bookmark does not exist.
7. Hides unexpected errors during bookmark removal.
8. Returns the authenticated user's bookmarked projects.
*/
