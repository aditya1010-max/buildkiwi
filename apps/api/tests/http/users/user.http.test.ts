import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import express from "express";
import request from "supertest";

import userRouter from "../../../src/routes/user.routes";

import {
  findUserByIdService,
  updateUserBioService,
} from "../../../src/services/user.service";

import { getProjectsByUserService } from "../../../src/services/project.services";

import { verifyAccessToken } from "../../../src/utils/jwt";

import { errorHandler } from "../../../src/middleware/errorHandler";

jest.mock("../../../src/services/user.service", () => ({
  findUserByIdService: jest.fn(),
  updateUserBioService: jest.fn(),
}));

jest.mock("../../../src/services/project.services", () => ({
  getProjectsByUserService: jest.fn(),
}));

jest.mock("../../../src/utils/jwt", () => ({
  verifyAccessToken: jest.fn(),
}));

const mockFindUserById = jest.mocked(findUserByIdService);
const mockUpdateUserBio = jest.mocked(updateUserBioService);
const mockGetProjectsByUser = jest.mocked(getProjectsByUserService);

const mockVerifyAccessToken = jest.mocked(verifyAccessToken);

const app = express();

app.use(express.json());
app.use("/users", userRouter);

// Important: production error handler must be part of HTTP tests
app.use(errorHandler);
describe("user HTTP", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockVerifyAccessToken.mockReturnValue({
      userId: "user-123",
      email: "aditya@example.com",
    });
  });

  describe("GET /users/:id", () => {
    it("returns a user profile", async () => {
      const user = {
        _id: "user-123",
        username: "aditya",
        email: "aditya@example.com",
        bio: "Full-stack developer",
      };

      mockFindUserById.mockResolvedValue(user as never);

      const response = await request(app).get("/users/user-123");

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        success: true,
        user,
      });

      expect(mockFindUserById).toHaveBeenCalledWith("user-123");
    });

    it("returns 404 when the user does not exist", async () => {
      mockFindUserById.mockResolvedValue(null);

      const response = await request(app).get("/users/user-123");

      expect(response.status).toBe(404);

      expect(response.body).toEqual({
        success: false,
        message: "User not found",
      });
    });
  });

  describe("GET /users/:id/projects", () => {
    it("returns projects belonging to a user", async () => {
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

      mockGetProjectsByUser.mockResolvedValue(projects as never);

      const response = await request(app).get("/users/user-123/projects");

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        success: true,
        data: projects,
      });

      expect(mockGetProjectsByUser).toHaveBeenCalledWith("user-123");
    });

    it("returns an empty project list when the user has no projects", async () => {
      mockGetProjectsByUser.mockResolvedValue([]);

      const response = await request(app).get("/users/user-123/projects");

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        success: true,
        data: [],
      });
    });
  });

  describe("PATCH /users/:id", () => {
    it("updates the authenticated user's profile", async () => {
      const updatedUser = {
        _id: "user-123",
        username: "aditya",
        bio: "Full-stack developer",
      };

      mockUpdateUserBio.mockResolvedValue(updatedUser as never);

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

      expect(mockUpdateUserBio).toHaveBeenCalledWith(
        "user-123",
        "Full-stack developer",
      );
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

      expect(mockUpdateUserBio).not.toHaveBeenCalled();
    });

    it("prevents a user from updating another user's profile", async () => {
      const response = await request(app)
        .patch("/users/other-user")
        .set("Authorization", "Bearer valid-access-token")
        .send({
          bio: "Trying to change someone else's profile",
        });

      expect(response.status).toBe(403);

      expect(response.body).toEqual({
        success: false,
        message: "You can only update your own profile",
      });

      expect(mockUpdateUserBio).not.toHaveBeenCalled();
    });

    it("returns 404 when the user does not exist", async () => {
      mockUpdateUserBio.mockResolvedValue(null);

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

      expect(mockUpdateUserBio).toHaveBeenCalledWith(
        "user-123",
        "Full-stack developer",
      );
    });
  });
});

/*
Test coverage:

1. Gets a user profile
   → Verifies the public profile endpoint passes the user ID to
     the service and returns the user.

2. Handles a missing user profile
   → Verifies a missing user produces a 404 response.

3. Gets a user's projects
   → Verifies the user's project list is returned.

4. Handles a user with no projects
   → Verifies an empty project list is returned successfully.

5. Updates the authenticated user's profile
   → Verifies the authenticated user's ID and validated bio reach
     the update service.

6. Rejects unauthenticated profile updates
   → Verifies authMiddleware prevents the controller from running.

7. Prevents updating another user's profile
   → Verifies the controller's ownership check returns 403 and
     does not call the update service.

8. Handles a missing user during update
   → Verifies the controller returns 404 when the update service
     returns null.
*/
