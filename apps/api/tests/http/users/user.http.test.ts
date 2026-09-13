import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import express from "express";
import request from "supertest";

import userRouter from "../../../src/routes/user.routes";

import {
  findPublicUserByUsernameService,
  updateUserProfileService,
} from "../../../src/services/user.service";

import { getProjectsByUserService } from "../../../src/services/project.services";

import { verifyAccessToken } from "../../../src/utils/jwt";

import { errorHandler } from "../../../src/middleware/errorHandler";

jest.mock("../../../src/services/user.service", () => ({
  findPublicUserByUsernameService: jest.fn(),
  updateUserProfileService: jest.fn(),
}));

jest.mock("../../../src/services/project.services", () => ({
  getProjectsByUserService: jest.fn(),
}));

jest.mock("../../../src/utils/jwt", () => ({
  verifyAccessToken: jest.fn(),
}));

const mockFindPublicUserByUsername = jest.mocked(
  findPublicUserByUsernameService,
);

const mockUpdateUserProfile = jest.mocked(updateUserProfileService);

const mockGetProjectsByUser = jest.mocked(getProjectsByUserService);

const mockVerifyAccessToken = jest.mocked(verifyAccessToken);

const app = express();

app.use(express.json());
app.use("/users", userRouter);
app.use(errorHandler);

describe("user HTTP", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockVerifyAccessToken.mockReturnValue({
      userId: "user-123",
      email: "aditya@example.com",
    });
  });

  describe("GET /users/:username", () => {
    it("returns a user profile", async () => {
      const user = {
        _id: "user-123",
        username: "aditya",
        avatarSeed: "seed",
        avatarPattern: "pattern",
        bio: "Full-stack developer",
        createdAt: "2026-01-01T00:00:00.000Z",
      };

      mockFindPublicUserByUsername.mockResolvedValue(user as never);

      const response = await request(app).get("/users/aditya");

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        success: true,
        user,
      });

      expect(mockFindPublicUserByUsername).toHaveBeenCalledWith("aditya");
    });

    it("returns 404 when the user does not exist", async () => {
      mockFindPublicUserByUsername.mockResolvedValue(null);

      const response = await request(app).get("/users/aditya");

      expect(response.status).toBe(404);

      expect(response.body).toEqual({
        success: false,
        message: "User not found",
      });

      expect(mockFindPublicUserByUsername).toHaveBeenCalledWith("aditya");
    });

    /*
    Test added:
    Verifies the public profile response contains createdAt,
    which is required by the frontend to render the user's join date.
    */
    it("returns createdAt for the public profile", async () => {
      const user = {
        _id: "user-123",
        username: "aditya",
        avatarSeed: "seed",
        avatarPattern: "pattern",
        bio: "Full-stack developer",
        createdAt: "2026-01-01T00:00:00.000Z",
      };

      mockFindPublicUserByUsername.mockResolvedValue(user as never);

      const response = await request(app).get("/users/aditya");

      expect(response.status).toBe(200);

      expect(response.body.user.createdAt).toBe("2026-01-01T00:00:00.000Z");
    });
  });

  describe("GET /users/:username/projects", () => {
    it("returns projects belonging to a user", async () => {
      const user = {
        _id: "user-123",
        username: "aditya",
        avatarSeed: "seed",
        avatarPattern: "pattern",
        bio: "Full-stack developer",
        createdAt: "2026-01-01T00:00:00.000Z",
      };

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

      mockFindPublicUserByUsername.mockResolvedValue(user as never);
      mockGetProjectsByUser.mockResolvedValue(projects as never);

      const response = await request(app).get("/users/aditya/projects");

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        success: true,
        data: projects,
      });

      expect(mockFindPublicUserByUsername).toHaveBeenCalledWith("aditya");

      expect(mockGetProjectsByUser).toHaveBeenCalledWith("user-123");
    });

    it("returns 404 when the user does not exist", async () => {
      mockFindPublicUserByUsername.mockResolvedValue(null);

      const response = await request(app).get("/users/aditya/projects");

      expect(response.status).toBe(404);

      expect(response.body).toEqual({
        success: false,
        message: "User not found",
      });

      expect(mockFindPublicUserByUsername).toHaveBeenCalledWith("aditya");

      expect(mockGetProjectsByUser).not.toHaveBeenCalled();
    });

    it("returns an empty project list when the user has no projects", async () => {
      const user = {
        _id: "user-123",
        username: "aditya",
        avatarSeed: "seed",
        avatarPattern: "pattern",
        bio: "Full-stack developer",
        createdAt: "2026-01-01T00:00:00.000Z",
      };

      mockFindPublicUserByUsername.mockResolvedValue(user as never);

      mockGetProjectsByUser.mockResolvedValue([]);

      const response = await request(app).get("/users/aditya/projects");

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        success: true,
        data: [],
      });

      expect(mockFindPublicUserByUsername).toHaveBeenCalledWith("aditya");

      expect(mockGetProjectsByUser).toHaveBeenCalledWith("user-123");
    });
  });

  describe("PATCH /users/:id", () => {
    it("updates the authenticated user's profile", async () => {
      const updatedUser = {
        _id: "user-123",
        username: "aditya",
        bio: "Full-stack developer",
      };

      mockUpdateUserProfile.mockResolvedValue(updatedUser as never);

      const response = await request(app)
        .patch("/users/user-123")
        .set("Authorization", "Bearer valid-access-token")
        .send({
          bio: "Full-stack developer",
        });

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        success: true,
        user: updatedUser,
      });

      expect(mockUpdateUserProfile).toHaveBeenCalledWith("user-123", {
        bio: "Full-stack developer",
      });
    });

    it("rejects an unauthenticated request", async () => {
      mockVerifyAccessToken.mockImplementation(() => {
        throw new Error("Invalid token");
      });

      const response = await request(app).patch("/users/user-123").send({
        bio: "Full-stack developer",
      });

      expect(response.status).toBe(401);

      expect(response.body).toEqual({
        success: false,
        message: "Unauthorized",
      });

      expect(mockUpdateUserProfile).not.toHaveBeenCalled();
    });

    it("prevents a user from updating another user's profile", async () => {
      const response = await request(app)
        .patch("/users/other-user-id")
        .set("Authorization", "Bearer valid-access-token")
        .send({
          bio: "Trying to change someone else's profile",
        });

      expect(response.status).toBe(403);

      expect(response.body).toEqual({
        success: false,
        message: "You can only update your own profile",
      });

      expect(mockUpdateUserProfile).not.toHaveBeenCalled();
    });

    it("returns 404 when the user does not exist", async () => {
      mockUpdateUserProfile.mockResolvedValue(null);

      const response = await request(app)
        .patch("/users/user-123")
        .set("Authorization", "Bearer valid-access-token")
        .send({
          bio: "Full-stack developer",
        });

      expect(response.status).toBe(404);

      expect(response.body).toEqual({
        success: false,
        message: "User not found",
      });

      expect(mockUpdateUserProfile).toHaveBeenCalledWith("user-123", {
        bio: "Full-stack developer",
      });
    });
  });
});

/*
Test coverage:

1. Gets a user profile
   → Verifies the public profile endpoint resolves the username
   and returns the public user.

2. Handles a missing user profile
   → Verifies a missing username produces a 404 response.

3. Returns createdAt for a public profile
   → Verifies the profile contains the creation date required
   by the frontend to display the user's join date.

4. Gets a user's projects
   → Verifies the username is resolved to a user ID before
   fetching that user's projects.

5. Handles a missing user when fetching projects
   → Verifies projects are not fetched when the username
   does not belong to an existing user.

6. Handles a user with no projects
   → Verifies an empty project list is returned successfully.

7. Updates the authenticated user's profile
   → Verifies the authenticated user's ID and validated data
   reach the update service.

8. Rejects unauthenticated profile updates
   → Verifies authMiddleware prevents the controller from running.

9. Prevents updating another user's profile
   → Verifies the controller's ownership check returns 403
   and does not call the update service.

10. Handles a missing user during update
    → Verifies the controller returns 404 when the update
    service returns null.
*/
