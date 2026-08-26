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

const mockProjectCreate = jest.mocked(projectRepository.create);
const mockFindAll = jest.mocked(projectRepository.findAll);
const mockCount = jest.mocked(projectRepository.count);
const mockFindByUserId = jest.mocked(projectRepository.findByUserId);
const mockFindById = jest.mocked(projectRepository.findById);
const mockFindByIdForUpdate = jest.mocked(projectRepository.findByIdForUpdate);
const mockProjectUpdate = jest.mocked(projectRepository.update);
const mockProjectDelete = jest.mocked(projectRepository.delete);

const mockGetEditableProjectById = jest.mocked(getEditableProjectById);

const mockSaveProject = jest.mocked(saveProjectRepository);
const mockUnsaveProject = jest.mocked(unsaveProjectRepository);
const mockGetSavedProjects = jest.mocked(getSavedProjectsRepository);

const mockCheckFirstProject = jest.mocked(checkFirstProject);

describe("project service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createProjectService", () => {
    it("creates a project and checks the first-project achievement", async () => {
      const data = {
        title: "BuildKiwi",
        description: "Developer platform",
        tags: ["React"],
        links: {
          github: "",
          demo: "",
        },
      };

      const project = {
        _id: "project-123",
        ...data,
        creatorId: "user-123",
      };

      const achievement = {
        key: "FIRST_PROJECT",
      };

      mockProjectCreate.mockResolvedValue(project as never);

      mockCheckFirstProject.mockResolvedValue(achievement as never);

      const result = await createProjectService(data, "user-123");

      expect(mockProjectCreate).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "BuildKiwi",
          description: "Developer platform",
          tags: ["React"],
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
      const projects = [
        {
          _id: "project-1",
        },
      ];

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

      expect(mockCount).toHaveBeenCalledWith();

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
    it("gets projects belonging to a user", async () => {
      const projects = [
        {
          _id: "project-1",
        },
      ];

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

    it("gets a project by ID", async () => {
      const project = {
        _id: "project-123",
      };

      mockFindById.mockResolvedValue(project as never);

      const result = await getProjectByIdService("project-123");

      expect(mockFindById).toHaveBeenCalledWith("project-123");

      expect(result).toBe(project);
    });
  });

  describe("updateProjectService", () => {
    it("updates a project when the user owns it", async () => {
      const project = {
        _id: "project-123",
        creatorId: {
          toString: () => "user-123",
        },
      };

      const updateData = {
        title: "Updated project",
      };

      const updatedProject = {
        _id: "project-123",
        title: "Updated project",
      };

      mockFindByIdForUpdate.mockResolvedValue(project as never);

      mockProjectUpdate.mockResolvedValue(updatedProject as never);

      const result = await updateProjectService(
        "project-123",
        updateData,
        "user-123",
      );

      expect(mockFindByIdForUpdate).toHaveBeenCalledWith("project-123");

      expect(mockProjectUpdate).toHaveBeenCalledWith("project-123", updateData);

      expect(result).toBe(updatedProject);
    });

    it("returns false when the project does not exist", async () => {
      mockFindByIdForUpdate.mockResolvedValue(null);

      const result = await updateProjectService(
        "project-123",
        {
          title: "Updated project",
        },
        "user-123",
      );

      expect(result).toBe(false);
      expect(mockProjectUpdate).not.toHaveBeenCalled();
    });

    it("rejects updates from users who do not own the project", async () => {
      const project = {
        _id: "project-123",
        creatorId: {
          toString: () => "owner-123",
        },
      };

      mockFindByIdForUpdate.mockResolvedValue(project as never);

      await expect(
        updateProjectService(
          "project-123",
          {
            title: "Updated project",
          },
          "other-user",
        ),
      ).rejects.toMatchObject({
        message: "Unauthorized: You do not own this project",
        statusCode: 403,
      });

      expect(mockProjectUpdate).not.toHaveBeenCalled();
    });
  });

  describe("deleteProjectService", () => {
    it("returns false when no project ID is provided", async () => {
      const result = await deleteProjectService("", "user-123");

      expect(result).toBe(false);
      expect(mockFindByIdForUpdate).not.toHaveBeenCalled();
    });

    it("deletes a project when the user owns it", async () => {
      const project = {
        _id: "project-123",
        creatorId: {
          toString: () => "user-123",
        },
      };

      mockFindByIdForUpdate.mockResolvedValue(project as never);

      mockProjectDelete.mockResolvedValue(true);

      const result = await deleteProjectService("project-123", "user-123");

      expect(mockProjectDelete).toHaveBeenCalledWith("project-123");

      expect(result).toBe(true);
    });

    it("throws when the project does not exist", async () => {
      mockFindByIdForUpdate.mockResolvedValue(null);

      await expect(
        deleteProjectService("project-123", "user-123"),
      ).rejects.toMatchObject({
        message: "Project not found",
        statusCode: 404,
      });

      expect(mockProjectDelete).not.toHaveBeenCalled();
    });

    it("rejects deletion from users who do not own the project", async () => {
      const project = {
        _id: "project-123",
        creatorId: {
          toString: () => "owner-123",
        },
      };

      mockFindByIdForUpdate.mockResolvedValue(project as never);

      await expect(
        deleteProjectService("project-123", "other-user"),
      ).rejects.toMatchObject({
        message: "You do not own this project",
        statusCode: 403,
      });

      expect(mockProjectDelete).not.toHaveBeenCalled();
    });
  });

  describe("saveProjectService", () => {
    it("saves a project for a user", async () => {
      mockSaveProject.mockResolvedValue({} as never);

      await saveProjectService("user-123", "project-123");

      expect(mockSaveProject).toHaveBeenCalledWith("user-123", "project-123");
    });
  });

  describe("unsaveProjectService", () => {
    it("removes a project from the user's saved projects", async () => {
      mockUnsaveProject.mockResolvedValue({} as never);

      await unsaveProjectService("user-123", "project-123");

      expect(mockUnsaveProject).toHaveBeenCalledWith("user-123", "project-123");
    });
  });

  describe("getSavedProjectsService", () => {
    it("returns the user's saved projects", async () => {
      const projects = [
        {
          _id: "project-123",
        },
      ];

      mockGetSavedProjects.mockResolvedValue(projects as never);

      const result = await getSavedProjectsService("user-123");

      expect(mockGetSavedProjects).toHaveBeenCalledWith("user-123");

      expect(result).toBe(projects);
    });
  });

  describe("getEditableProjectService", () => {
    it("gets a project editable by the authenticated user", async () => {
      const project = {
        _id: "project-123",
        creatorId: "user-123",
      };

      mockGetEditableProjectById.mockResolvedValue(project as never);

      const result = await getEditableProjectService("project-123", "user-123");

      expect(mockGetEditableProjectById).toHaveBeenCalledWith(
        "project-123",
        "user-123",
      );

      expect(result).toBe(project);
    });
  });
});

/*
Test coverage:

1. Creates a project
   → Verifies the creator ID is attached to the project and the
     first-project achievement check is triggered.

2. Gets projects with pagination
   → Verifies the repository receives the search/filter options and
     the service calculates totalPages and hasMore correctly.

3. Gets projects by user
   → Verifies the service requests projects belonging to the user.

4. Gets a project by ID
   → Verifies an empty ID returns null and a valid ID is passed to
     the repository.

5. Updates an owned project
   → Verifies only the project owner can update the project.

6. Handles a missing project during update
   → Verifies false is returned and no update is attempted.

7. Rejects an unauthorized project update
   → Verifies a 403 AppError is thrown when the authenticated user
     does not own the project.

8. Handles an empty ID during deletion
   → Verifies false is returned without querying the repository.

9. Deletes an owned project
   → Verifies only the project owner can delete the project.

10. Handles a missing project during deletion
    → Verifies a 404 AppError is thrown when the project does not exist.

11. Rejects an unauthorized deletion
    → Verifies a 403 AppError is thrown when another user owns the project.

12. Saves a project
    → Verifies the service delegates the user and project IDs to the
      save repository.

13. Unsaves a project
    → Verifies the service delegates the user and project IDs to the
      unsave repository.

14. Gets saved projects
    → Verifies the service returns the user's saved projects.

15. Gets an editable project
    → Verifies the project ID and authenticated user ID are passed to
      the ownership-aware repository function.
*/
