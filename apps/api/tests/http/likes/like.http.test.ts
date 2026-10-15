import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import express from "express";
import request from "supertest";

import likeRouter from "../../../src/routes/like.routes";

import {
  addLikeService,
  removeLikeService,
  getLikesService,
} from "../../../src/services/like.service";

import { verifyAccessToken } from "../../../src/utils/jwt";
import { errorHandler } from "../../../src/middleware/errorHandler";
import { AppError } from "../../../src/utils/AppError";

jest.mock("../../../src/services/like.service", () => ({
  addLikeService: jest.fn(),
  removeLikeService: jest.fn(),
  getLikesService: jest.fn(),
}));

jest.mock("../../../src/utils/jwt", () => ({
  verifyAccessToken: jest.fn(),
}));

const mockAddLike = jest.mocked(addLikeService);
const mockRemoveLike = jest.mocked(removeLikeService);
const mockGetLikes = jest.mocked(getLikesService);
const mockVerifyAccessToken = jest.mocked(verifyAccessToken);

const app = express();

app.use(express.json());
app.use("/likes", likeRouter);
app.use(errorHandler);

describe("like HTTP", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockVerifyAccessToken.mockReturnValue({
      userId: "user-123",
      email: "aditya@example.com",
    });
  });

  describe("POST /likes/:projectId", () => {
    it("adds a like successfully", async () => {
      const like = {
        _id: "like-123",
        userId: "user-123",
        projectId: "project-123",
      };

      mockAddLike.mockResolvedValue(like as never);

      const response = await request(app)
        .post("/likes/project-123")
        .set("Authorization", "Bearer valid-access-token");

      expect(response.status).toBe(201);

      expect(response.body).toEqual({
        success: true,
        data: like,
      });

      expect(mockAddLike).toHaveBeenCalledWith("user-123", "project-123");
    });

    it("returns 409 when the project is already liked", async () => {
      mockAddLike.mockRejectedValue(
        new AppError("Project already liked.", 409),
      );

      const response = await request(app)
        .post("/likes/project-123")
        .set("Authorization", "Bearer valid-access-token");

      expect(response.status).toBe(409);

      expect(response.body).toEqual({
        success: false,
        message: "Project already liked.",
      });
    });

    it("returns 404 when the project does not exist", async () => {
      mockAddLike.mockRejectedValue(new AppError("Project not found.", 404));

      const response = await request(app)
        .post("/likes/project-123")
        .set("Authorization", "Bearer valid-access-token");

      expect(response.status).toBe(404);

      expect(response.body).toEqual({
        success: false,
        message: "Project not found.",
      });
    });

    it("hides unexpected errors when adding a like fails", async () => {
      mockAddLike.mockRejectedValue(new Error("Unexpected database failure"));

      const response = await request(app)
        .post("/likes/project-123")
        .set("Authorization", "Bearer valid-access-token");

      expect(response.status).toBe(500);

      expect(response.body).toEqual({
        success: false,
        message: "Internal Server Error",
      });
    });

    it("rejects an unauthenticated request", async () => {
      mockVerifyAccessToken.mockImplementation(() => {
        throw new Error("Invalid token");
      });

      const response = await request(app).post("/likes/project-123");

      expect(response.status).toBe(401);

      expect(response.body).toEqual({
        success: false,
        message: "Unauthorized",
      });

      expect(mockAddLike).not.toHaveBeenCalled();
    });
  });

  describe("DELETE /likes/:projectId", () => {
    it("removes a like successfully", async () => {
      mockRemoveLike.mockResolvedValue({} as never);

      const response = await request(app)
        .delete("/likes/project-123")
        .set("Authorization", "Bearer valid-access-token");

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        success: true,
        message: "Like removed successfully.",
      });

      expect(mockRemoveLike).toHaveBeenCalledWith("user-123", "project-123");
    });

    it("returns 404 when the like does not exist", async () => {
      mockRemoveLike.mockRejectedValue(new AppError("Like not found.", 404));

      const response = await request(app)
        .delete("/likes/project-123")
        .set("Authorization", "Bearer valid-access-token");

      expect(response.status).toBe(404);

      expect(response.body).toEqual({
        success: false,
        message: "Like not found.",
      });
    });

    it("returns 404 when the project does not exist", async () => {
      mockRemoveLike.mockRejectedValue(new AppError("Project not found.", 404));

      const response = await request(app)
        .delete("/likes/project-123")
        .set("Authorization", "Bearer valid-access-token");

      expect(response.status).toBe(404);

      expect(response.body).toEqual({
        success: false,
        message: "Project not found.",
      });
    });

    it("hides unexpected errors when removing a like fails", async () => {
      mockRemoveLike.mockRejectedValue(
        new Error("Unexpected database failure"),
      );

      const response = await request(app)
        .delete("/likes/project-123")
        .set("Authorization", "Bearer valid-access-token");

      expect(response.status).toBe(500);

      expect(response.body).toEqual({
        success: false,
        message: "Internal Server Error",
      });
    });

    it("rejects an unauthenticated request", async () => {
      mockVerifyAccessToken.mockImplementation(() => {
        throw new Error("Invalid token");
      });

      const response = await request(app).delete("/likes/project-123");

      expect(response.status).toBe(401);

      expect(response.body).toEqual({
        success: false,
        message: "Unauthorized",
      });

      expect(mockRemoveLike).not.toHaveBeenCalled();
    });
  });

  describe("GET /likes", () => {
    it("returns the user's liked projects", async () => {
      const likes = [
        {
          _id: "like-1",
          projectId: {
            _id: "project-1",
            title: "Project One",
            description: "First project",
            tags: ["react"],
            coverImage: "cover-1",
            links: {
              github: "github-1",
              demo: "demo-1",
            },
            stats: {
              likes: 10,
              comments: 2,
              views: 100,
            },
            creatorId: {
              _id: "user-1",
              username: "creator-one",
              avatarSeed: "avatar-seed-1",
              avatarPattern: "blobs",
            },
            createdAt: "2026-09-01T00:00:00.000Z",
            updatedAt: "2026-09-01T00:00:00.000Z",
          },
        },
        {
          _id: "like-2",
          projectId: {
            _id: "project-2",
            title: "Project Two",
            description: "Second project",
            tags: ["typescript"],
            coverImage: "cover-2",
            links: {
              github: "github-2",
              demo: "demo-2",
            },
            stats: {
              likes: 20,
              comments: 4,
              views: 200,
            },
            creatorId: {
              _id: "user-2",
              username: "creator-two",
              avatarSeed: "avatar-seed-2",
              avatarPattern: "waves",
            },
            createdAt: "2026-09-02T00:00:00.000Z",
            updatedAt: "2026-09-02T00:00:00.000Z",
          },
        },
      ];

      mockGetLikes.mockResolvedValue(likes as never);

      const response = await request(app)
        .get("/likes")
        .set("Authorization", "Bearer valid-access-token");

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        success: true,
        data: likes,
      });

      expect(mockGetLikes).toHaveBeenCalledWith("user-123");
    });

    it("rejects an unauthenticated request", async () => {
      mockVerifyAccessToken.mockImplementation(() => {
        throw new Error("Invalid token");
      });

      const response = await request(app).get("/likes");

      expect(response.status).toBe(401);

      expect(response.body).toEqual({
        success: false,
        message: "Unauthorized",
      });

      expect(mockGetLikes).not.toHaveBeenCalled();
    });
  });
});

/*
Test coverage:

1. Adds a like successfully.
2. Returns HTTP 409 when the project is already liked.
3. Returns HTTP 404 when the project does not exist.
4. Hides unexpected errors during like creation.
5. Rejects unauthenticated like creation.
6. Removes a like successfully.
7. Returns HTTP 404 when the like does not exist.
8. Returns HTTP 404 when the project does not exist during removal.
9. Hides unexpected errors during like removal.
10. Rejects unauthenticated like removal.
11. Returns the user's liked projects and populated project data.
12. Rejects unauthenticated like retrieval.
*/
