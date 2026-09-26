import { beforeEach, describe, expect, it, jest } from "@jest/globals";

import {
  getEditableProjectById,
  projectRepository,
} from "../../../src/repositories/project.repository";

import {
  getSavedProjectsRepository,
  saveProjectRepository,
  unsaveProjectRepository,
} from "../../../src/repositories/user.repository";

import { checkFirstProject } from "../../../src/services/achievement.service";

import {
  createProjectService,
  getProjectsService,
  getProjectsByUserService,
  getProjectByIdService,
  updateProjectService,
  deleteProjectService,
  saveProjectService,
  unsaveProjectService,
  getSavedProjectsService,
  getEditableProjectService,
} from "../../../src/services/project.services";

jest.mock("../../../src/repositories/project.repository", () => ({
  projectRepository: {
    create: jest.fn(),
    findAll: jest.fn(),
    count: jest.fn(),
    findByUserId: jest.fn(),
    findById: jest.fn(),
    findByIdForUpdate: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  getEditableProjectById: jest.fn(),
}));

jest.mock("../../../src/repositories/user.repository", () => ({
  getSavedProjectsRepository: jest.fn(),
  saveProjectRepository: jest.fn(),
  unsaveProjectRepository: jest.fn(),
}));

jest.mock("../../../src/services/achievement.service", () => ({
  checkFirstProject: jest.fn(),
}));

const mockCreateProject = jest.mocked(projectRepository.create);
const mockFindAll = jest.mocked(projectRepository.findAll);
const mockCount = jest.mocked(projectRepository.count);
const mockFindByUserId = jest.mocked(projectRepository.findByUserId);
const mockFindById = jest.mocked(projectRepository.findById);
const mockFindByIdForUpdate = jest.mocked(projectRepository.findByIdForUpdate);
const mockUpdate = jest.mocked(projectRepository.update);
const mockDelete = jest.mocked(projectRepository.delete);

const mockGetEditableProject = jest.mocked(getEditableProjectById);

const mockGetSavedProjects = jest.mocked(getSavedProjectsRepository);
const mockSaveProject = jest.mocked(saveProjectRepository);
const mockUnsaveProject = jest.mocked(unsaveProjectRepository);

const mockCheckFirstProject = jest.mocked(checkFirstProject);

describe("project service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createProjectService", () => {
    it("creates a project and checks the first-project achievement", async () => {
      const project = { _id: "project-123" };
      const achievement = { key: "FIRST_PROJECT" };

      mockCreateProject.mockResolvedValue(project as never);
      mockCheckFirstProject.mockResolvedValue(achievement as never);

      const result = await createProjectService(
        {
          title: "BuildKiwi",
          description: "Developer platform",
          tags: [],
          links: {
            github: "",
            demo: "",
          },
          coverSeed: "test-seed",
        },
        "user-123",
      );

      expect(mockCreateProject).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "BuildKiwi",
          description: "Developer platform",
          creatorId: "user-123",
        }),
      );

      expect(mockCheckFirstProject).toHaveBeenCalledWith("user-123");

      expect(result).toEqual({
        project,
        achievement,
      });
    });
  });

  describe("getProjectsService", () => {
    it("returns projects with calculated pagination", async () => {
      const projects = [{ _id: "project-1" }];

      mockFindAll.mockResolvedValue(projects as never);
      mockCount.mockResolvedValue(25);

      const result = await getProjectsService({
        page: 2,
        limit: 10,
        query: "react",
        filter: "projects",
      });

      expect(mockFindAll).toHaveBeenCalledWith({
        page: 2,
        limit: 10,
        query: "react",
        filter: "projects",
      });

      expect(result).toEqual({
        projects,
        pagination: {
          total: 25,
          page: 2,
          limit: 10,
          totalPages: 3,
          hasMore: true,
        },
      });
    });
  });

  describe("getProjectsByUserService", () => {
    it("returns projects belonging to the user", async () => {
      const projects = [{ _id: "project-1" }];

      mockFindByUserId.mockResolvedValue(projects as never);

      const result = await getProjectsByUserService("user-123");

      expect(mockFindByUserId).toHaveBeenCalledWith("user-123");
      expect(result).toBe(projects);
    });
  });

  describe("getProjectByIdService", () => {
    it("returns null when no project ID is provided", async () => {
      const result = await getProjectByIdService("");

      expect(result).toBeNull();
      expect(mockFindById).not.toHaveBeenCalled();
    });

    it("returns the project for a valid ID", async () => {
      const project = { _id: "project-123" };

      mockFindById.mockResolvedValue(project as never);

      const result = await getProjectByIdService("project-123");

      expect(mockFindById).toHaveBeenCalledWith("project-123");
      expect(result).toBe(project);
    });
  });

  describe("updateProjectService", () => {
    it("updates a project owned by the user", async () => {
      const project = {
        creatorId: {
          toString: () => "user-123",
        },
      };

      const updatedProject = {
        _id: "project-123",
        title: "Updated project",
      };

      mockFindByIdForUpdate.mockResolvedValue(project as never);
      mockUpdate.mockResolvedValue(updatedProject as never);

      const result = await updateProjectService(
        "project-123",
        { title: "Updated project" },
        "user-123",
      );

      expect(mockFindByIdForUpdate).toHaveBeenCalledWith("project-123");
      expect(mockUpdate).toHaveBeenCalledWith("project-123", {
        title: "Updated project",
      });

      expect(result).toBe(updatedProject);
    });

    it("rejects an update when the user does not own the project", async () => {
      const project = {
        creatorId: {
          toString: () => "different-user",
        },
      };

      mockFindByIdForUpdate.mockResolvedValue(project as never);

      await expect(
        updateProjectService(
          "project-123",
          { title: "Updated project" },
          "user-123",
        ),
      ).rejects.toMatchObject({
        message: "Unauthorized: You do not own this project",
        statusCode: 403,
      });

      expect(mockUpdate).not.toHaveBeenCalled();
    });
  });

  describe("deleteProjectService", () => {
    it("deletes a project owned by the user", async () => {
      const project = {
        creatorId: {
          toString: () => "user-123",
        },
      };

      mockFindByIdForUpdate.mockResolvedValue(project as never);
      mockDelete.mockResolvedValue(project as never);

      const result = await deleteProjectService("project-123", "user-123");

      expect(mockFindByIdForUpdate).toHaveBeenCalledWith("project-123");
      expect(mockDelete).toHaveBeenCalledWith("project-123");
      expect(result).toBe(project);
    });

    it("rejects deletion when the project does not exist", async () => {
      mockFindByIdForUpdate.mockResolvedValue(null);

      await expect(
        deleteProjectService("project-123", "user-123"),
      ).rejects.toMatchObject({
        message: "Project not found",
        statusCode: 404,
      });

      expect(mockDelete).not.toHaveBeenCalled();
    });

    it("rejects deletion when the user does not own the project", async () => {
      const project = {
        creatorId: {
          toString: () => "different-user",
        },
      };

      mockFindByIdForUpdate.mockResolvedValue(project as never);

      await expect(
        deleteProjectService("project-123", "user-123"),
      ).rejects.toMatchObject({
        message: "You do not own this project",
        statusCode: 403,
      });

      expect(mockDelete).not.toHaveBeenCalled();
    });
  });

  describe("saved project services", () => {
    it("saves a project for a user", async () => {
      mockSaveProject.mockResolvedValue(undefined as never);

      await saveProjectService("user-123", "project-123");

      expect(mockSaveProject).toHaveBeenCalledWith("user-123", "project-123");
    });

    it("unsaves a project for a user", async () => {
      mockUnsaveProject.mockResolvedValue(undefined as never);

      await unsaveProjectService("user-123", "project-123");

      expect(mockUnsaveProject).toHaveBeenCalledWith("user-123", "project-123");
    });

    it("returns saved projects for a user", async () => {
      const projects = [{ _id: "project-1" }];

      mockGetSavedProjects.mockResolvedValue(projects as never);

      const result = await getSavedProjectsService("user-123");

      expect(mockGetSavedProjects).toHaveBeenCalledWith("user-123");
      expect(result).toBe(projects);
    });
  });

  describe("getEditableProjectService", () => {
    it("returns the project editable by the authenticated user", async () => {
      const project = { _id: "project-123" };

      mockGetEditableProject.mockResolvedValue(project as never);

      const result = await getEditableProjectService("project-123", "user-123");

      expect(mockGetEditableProject).toHaveBeenCalledWith(
        "project-123",
        "user-123",
      );

      expect(result).toBe(project);
    });
  });
});

/*
Test coverage:

1. Creates a project and checks the first-project achievement
   → Verifies the creator ID is added before repository creation and the
     first-project achievement check is triggered afterward.

2. Returns projects with calculated pagination
   → Verifies project results are returned with the correct total pages
     and hasMore calculation.

3. Returns projects belonging to the user
   → Verifies the user ID is passed to the repository and its result is
     returned.

4. Handles a missing project ID
   → Verifies the service does not query the repository when no ID exists.

5. Returns a project for a valid ID
   → Verifies a valid project ID is passed to the repository.

6. Updates an owned project
   → Verifies only the project owner can update the project and that the
     update repository is called with the correct data.

7. Rejects an update by a non-owner
   → Verifies unauthorized users receive a 403 error and the project is
     not updated.

8. Deletes an owned project
   → Verifies only the project owner can delete the project.

9. Rejects deletion of a missing project
   → Verifies a missing project produces a 404 error.

10. Rejects deletion by a non-owner
    → Verifies unauthorized users receive a 403 error and deletion does
      not occur.

11. Saves a project
    → Verifies the correct user and project IDs are passed to the save
      repository.

12. Unsaves a project
    → Verifies the correct user and project IDs are passed to the unsave
      repository.

13. Returns saved projects
    → Verifies saved projects are retrieved for the requested user.

14. Returns an editable project
    → Verifies the project ID and authenticated user ID are passed to the
      authorization-aware repository function.
*/
