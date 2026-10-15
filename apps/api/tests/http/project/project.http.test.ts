import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import express from "express";
import request from "supertest";

import projectRouter from "../../../src/routes/project.routes";

import {
  createProjectService,
  getProjectsService,
  getProjectByIdService,
  updateProjectService,
  deleteProjectService,
  saveProjectService,
  unsaveProjectService,
  getSavedProjectsService,
  getEditableProjectService,
  getProjectsByUserService,
} from "../../../src/services/project.services";
import { errorHandler } from "../../../src/middleware/errorHandler";
import { verifyAccessToken } from "../../../src/utils/jwt";

jest.mock("../../../src/services/project.services", () => ({
  createProjectService: jest.fn(),
  getProjectsService: jest.fn(),
  getProjectByIdService: jest.fn(),
  updateProjectService: jest.fn(),
  deleteProjectService: jest.fn(),
  saveProjectService: jest.fn(),
  unsaveProjectService: jest.fn(),
  getSavedProjectsService: jest.fn(),
  getEditableProjectService: jest.fn(),
  getProjectsByUserService: jest.fn(),
}));

jest.mock("../../../src/utils/jwt", () => ({
  verifyAccessToken: jest.fn(),
}));

const mockCreateProject = jest.mocked(createProjectService);
const mockGetProjects = jest.mocked(getProjectsService);
const mockUpdateProject = jest.mocked(updateProjectService);
const mockDeleteProject = jest.mocked(deleteProjectService);

const mockGetSavedProjects = jest.mocked(getSavedProjectsService);
const mockGetEditableProject = jest.mocked(getEditableProjectService);
const mockGetMyProjects = jest.mocked(getProjectsByUserService);

const mockGetProjectById = jest.mocked(
  getProjectByIdService,
) as jest.MockedFunction<(id: string) => Promise<unknown | null>>;

const mockSaveProject = jest.mocked(saveProjectService) as jest.MockedFunction<
  (userId: string, projectId: string) => Promise<unknown | null>
>;

const mockUnsaveProject = jest.mocked(
  unsaveProjectService,
) as jest.MockedFunction<
  (userId: string, projectId: string) => Promise<unknown | null>
>;

const mockVerifyAccessToken = jest.mocked(verifyAccessToken);

const app = express();

app.use(express.json());
app.use("/projects", projectRouter);

app.use(errorHandler);

describe("project HTTP", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    mockVerifyAccessToken.mockReturnValue({
      userId: "user-123",
      email: "aditya@example.com",
    });
  });

  describe("GET /projects", () => {
    it("returns projects with pagination", async () => {
      const projects = [
        {
          _id: "project-1",
          title: "BuildKiwi",
        },
      ];

      mockGetProjects.mockResolvedValue({
        projects,
        pagination: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
          hasMore: false,
        },
      } as never);

      const response = await request(app).get("/projects").query({
        page: 1,
        limit: 10,
      });

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        success: true,
        data: projects,
        pagination: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
          hasMore: false,
        },
      });

      expect(mockGetProjects).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        query: undefined,
        filter: undefined,
      });
    });

    it("passes search and filter parameters to the service", async () => {
      mockGetProjects.mockResolvedValue({
        projects: [],
        pagination: {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 0,
          hasMore: false,
        },
      } as never);

      await request(app).get("/projects").query({
        page: 1,
        limit: 10,
        q: "react",
        filter: "projects",
      });

      expect(mockGetProjects).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        query: "react",
        filter: "projects",
      });
    });
  });

  describe("GET /projects/:id", () => {
    it("returns a project by ID", async () => {
      const project = {
        _id: "project-123",
        title: "BuildKiwi",
      };

      mockGetProjectById.mockResolvedValue(project as never);

      const response = await request(app).get("/projects/project-123");

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        success: true,
        data: project,
      });

      expect(mockGetProjectById).toHaveBeenCalledWith("project-123");
    });

    it("returns 404 when the project does not exist", async () => {
      mockGetProjectById.mockResolvedValue(null);

      const response = await request(app).get("/projects/project-123");

      expect(response.status).toBe(404);

      expect(response.body).toEqual({
        success: false,
        message: "Project not found",
      });
    });
  });

  describe("POST /projects", () => {
    it("creates a project for the authenticated user", async () => {
      const project = {
        _id: "project-123",
        title: "BuildKiwi",
        description: "Developer platform",
        tags: ["React"],
      };

      mockCreateProject.mockResolvedValue({
        project,
        achievement: null,
      } as never);

      const response = await request(app)
        .post("/projects")
        .set("Authorization", "Bearer valid-access-token")
        .field("title", "BuildKiwi")
        .field("description", "Developer platform")
        .field("tags", JSON.stringify(["React"]))
        .field("coverSeed", "test-seed")
        .field("github", "https://github.com/example")
        .field("demo", "https://buildkiwi.dev");

      expect(response.status).toBe(201);

      expect(response.body).toEqual({
        success: true,
        data: project,
        achievement: null,
      });

      expect(mockCreateProject).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "BuildKiwi",
          description: "Developer platform",
          tags: ["React"],
          coverSeed: "test-seed",
          links: {
            github: "https://github.com/example",
            demo: "https://buildkiwi.dev",
          },
        }),
        "user-123",
      );
    });

    it("rejects an unauthenticated request", async () => {
      mockVerifyAccessToken.mockImplementation(() => {
        throw new Error("Invalid token");
      });

      const response = await request(app)
        .post("/projects")
        .field("title", "BuildKiwi")
        .field("description", "Developer platform");

      expect(response.status).toBe(401);

      expect(response.body).toEqual({
        success: false,
        message: "Unauthorized",
      });

      expect(mockCreateProject).not.toHaveBeenCalled();
    });
  });

  describe("PATCH /projects/:id", () => {
    it("updates an owned project", async () => {
      const updatedProject = {
        _id: "project-123",
        title: "Updated BuildKiwi",
      };

      mockUpdateProject.mockResolvedValue(updatedProject as never);

      const response = await request(app)
        .patch("/projects/project-123")
        .set("Authorization", "Bearer valid-access-token")
        .field("title", "Updated BuildKiwi")
        .field("description", "Updated project description");

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        success: true,
        data: updatedProject,
      });

      expect(mockUpdateProject).toHaveBeenCalledWith(
        "project-123",
        expect.objectContaining({
          title: "Updated BuildKiwi",
          description: "Updated project description",
        }),
        "user-123",
      );
    });

    it("returns 404 when the project cannot be updated", async () => {
      mockUpdateProject.mockResolvedValue(false);

      const response = await request(app)
        .patch("/projects/project-123")
        .set("Authorization", "Bearer valid-access-token")
        .field("title", "Updated BuildKiwi")
        .field("description", "Updated project description");

      expect(response.status).toBe(404);

      expect(response.body).toEqual({
        success: false,
        message: "Project not found or unauthorized",
      });
    });

    it("rejects an unauthenticated update", async () => {
      mockVerifyAccessToken.mockImplementation(() => {
        throw new Error("Invalid token");
      });

      const response = await request(app)
        .patch("/projects/project-123")
        .field("title", "Updated BuildKiwi")
        .field("description", "Updated project description");

      expect(response.status).toBe(401);

      expect(mockUpdateProject).not.toHaveBeenCalled();
    });
  });

  describe("DELETE /projects/:id", () => {
    it("deletes a project successfully", async () => {
      mockDeleteProject.mockResolvedValue(true);

      const response = await request(app)
        .delete("/projects/project-123")
        .set("Authorization", "Bearer valid-access-token");

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        success: true,
        message: "Project deleted successfully",
      });

      expect(mockDeleteProject).toHaveBeenCalledWith("project-123", "user-123");
    });

    it("returns 404 when the project cannot be deleted", async () => {
      mockDeleteProject.mockResolvedValue(false);

      const response = await request(app)
        .delete("/projects/project-123")
        .set("Authorization", "Bearer valid-access-token");

      expect(response.status).toBe(404);

      expect(response.body).toEqual({
        success: false,
        message: "Project not found or unauthorized",
      });
    });

    it("rejects an unauthenticated request", async () => {
      mockVerifyAccessToken.mockImplementation(() => {
        throw new Error("Invalid token");
      });

      const response = await request(app).delete("/projects/project-123");

      expect(response.status).toBe(401);

      expect(mockDeleteProject).not.toHaveBeenCalled();
    });
  });

  describe("POST /projects/:id/save", () => {
    it("saves a project", async () => {
      mockSaveProject.mockResolvedValue(undefined);

      const response = await request(app)
        .post("/projects/project-123/save")
        .set("Authorization", "Bearer valid-access-token");

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        success: true,
        message: "Project saved successfully",
      });

      expect(mockSaveProject).toHaveBeenCalledWith("user-123", "project-123");
    });
  });

  describe("DELETE /projects/:id/save", () => {
    it("removes a project from saved projects", async () => {
      mockUnsaveProject.mockResolvedValue(undefined);

      const response = await request(app)
        .delete("/projects/project-123/save")
        .set("Authorization", "Bearer valid-access-token");

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        success: true,
        message: "Project removed from saved successfully",
      });

      expect(mockUnsaveProject).toHaveBeenCalledWith("user-123", "project-123");
    });
  });

  describe("GET /projects/saved", () => {
    it("returns the user's saved projects", async () => {
      const projects = [
        {
          _id: "project-1",
          title: "BuildKiwi",
        },
      ];

      mockGetSavedProjects.mockResolvedValue(projects as never);

      const response = await request(app)
        .get("/projects/saved")
        .set("Authorization", "Bearer valid-access-token");

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        success: true,
        data: projects,
      });

      expect(mockGetSavedProjects).toHaveBeenCalledWith("user-123");
    });
  });

  describe("GET /projects/mine", () => {
    it("returns the authenticated user's projects", async () => {
      const projects = [
        {
          _id: "project-1",
          title: "BuildKiwi",
        },
      ];

      mockGetMyProjects.mockResolvedValue(projects as never);

      const response = await request(app)
        .get("/projects/mine")
        .set("Authorization", "Bearer valid-access-token");

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        success: true,
        data: projects,
      });

      expect(mockGetMyProjects).toHaveBeenCalledWith("user-123");
    });
  });

  describe("GET /projects/:id/edit", () => {
    it("returns an editable project for its owner", async () => {
      const project = {
        _id: "project-123",
        creatorId: "user-123",
        title: "BuildKiwi",
      };

      mockGetEditableProject.mockResolvedValue(project as never);

      const response = await request(app)
        .get("/projects/project-123/edit")
        .set("Authorization", "Bearer valid-access-token");

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        success: true,
        data: project,
      });

      expect(mockGetEditableProject).toHaveBeenCalledWith(
        "project-123",
        "user-123",
      );
    });

    it("returns 404 when the project is not editable", async () => {
      mockGetEditableProject.mockResolvedValue(null);

      const response = await request(app)
        .get("/projects/project-123/edit")
        .set("Authorization", "Bearer valid-access-token");

      expect(response.status).toBe(404);

      expect(response.body).toEqual({
        success: false,
        message: "Project not found or unauthorized",
      });
    });
  });
});

/*
Test coverage:

1. Gets projects
   → Verifies the public projects endpoint returns project data and
     pagination information.

2. Searches and filters projects
   → Verifies query-string search and filter parameters are passed
     correctly to the service.

3. Gets a single project
   → Verifies a valid project ID returns the project.

4. Handles a missing project
   → Verifies the endpoint returns 404 when the service returns null.

5. Creates a project
   → Verifies authentication, multipart form handling, tag parsing,
     link parsing, and the project creation response.

6. Rejects unauthenticated project creation
   → Verifies the auth middleware prevents the service from being called.

7. Updates a project
   → Verifies the authenticated user ID and multipart form data reach
     the update service.

8. Handles an unsuccessful update
   → Verifies the controller returns 404 when the service returns false.

9. Rejects unauthenticated updates
   → Verifies authentication is required.

10. Deletes a project
    → Verifies the authenticated user can request project deletion.

11. Handles an unsuccessful deletion
    → Verifies the controller returns 404 when deletion returns false.

12. Saves a project
    → Verifies the authenticated user and project ID reach the save service.

13. Unsaves a project
    → Verifies the authenticated user and project ID reach the unsave service.

14. Gets saved projects
    → Verifies the authenticated user's saved projects are returned.

15. Gets the user's own projects
    → Verifies /mine uses the authenticated user's ID.

16. Gets an editable project
    → Verifies the project ID and authenticated user ID reach the
      ownership-aware service.

17. Handles an unauthorized/nonexistent editable project
    → Verifies the controller returns 404 when no editable project exists.
*/
