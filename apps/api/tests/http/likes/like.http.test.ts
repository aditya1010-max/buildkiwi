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

    it("returns an error when the project is already liked", async () => {
      mockAddLike.mockRejectedValue(new Error("Project already liked."));

      const response = await request(app)
        .post("/likes/project-123")
        .set("Authorization", "Bearer valid-access-token");

      expect(response.status).toBe(500);

      expect(response.body).toEqual({
        success: false,
        message: "Project already liked.",
      });
    });

    it("returns an error when the project does not exist", async () => {
      mockAddLike.mockRejectedValue(new Error("Project not found."));

      const response = await request(app)
        .post("/likes/project-123")
        .set("Authorization", "Bearer valid-access-token");

      expect(response.status).toBe(500);

      expect(response.body).toEqual({
        success: false,
        message: "Project not found.",
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

    it("returns an error when the like does not exist", async () => {
      mockRemoveLike.mockRejectedValue(new Error("Like not found."));

      const response = await request(app)
        .delete("/likes/project-123")
        .set("Authorization", "Bearer valid-access-token");

      expect(response.status).toBe(500);

      expect(response.body).toEqual({
        success: false,
        message: "Like not found.",
      });
    });

    it("returns an error when the project does not exist", async () => {
      mockRemoveLike.mockRejectedValue(new Error("Project not found."));

      const response = await request(app)
        .delete("/likes/project-123")
        .set("Authorization", "Bearer valid-access-token");

      expect(response.status).toBe(500);

      expect(response.body).toEqual({
        success: false,
        message: "Project not found.",
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

1. Adds a like
   → Verifies an authenticated request reaches the controller,
     passes the authenticated user ID and project ID to the service,
     and returns the created like.

2. Handles an already-liked project
   → Verifies a service error is returned to the HTTP client.

3. Handles a missing project
   → Verifies a project-not-found error reaches the HTTP response.

4. Rejects unauthenticated like creation
   → Verifies the auth middleware blocks the request before
     the service is called.

5. Removes a like
   → Verifies an authenticated request passes the correct user and
     project IDs to the service and returns the expected response.

6. Handles a missing like
   → Verifies the service error reaches the HTTP response.

7. Handles a missing project during removal
   → Verifies the project-not-found error reaches the HTTP response.

8. Rejects unauthenticated like removal
   → Verifies auth middleware prevents the service from being called.

9. Gets the user's liked projects
   → Verifies populated project data, including creator avatarSeed
     and avatarPattern, is returned by the HTTP endpoint.

10. Rejects unauthenticated like retrieval
    → Verifies auth middleware prevents access to the endpoint.
*/
