import { beforeEach, describe, expect, it, jest } from "@jest/globals";

import { likeRepository } from "../../../src/repositories/like.repository";
import { projectRepository } from "../../../src/repositories/project.repository";

import {
  addLikeService,
  removeLikeService,
  getLikesService,
} from "../../../src/services/like.service";

jest.mock("../../../src/repositories/like.repository", () => ({
  likeRepository: {
    create: jest.fn(),
    find: jest.fn(),
    delete: jest.fn(),
    findByUserId: jest.fn(),
  },
}));

jest.mock("../../../src/repositories/project.repository", () => ({
  projectRepository: {
    findByIdForUpdate: jest.fn(),
  },
}));

const mockLikeCreate = jest.mocked(likeRepository.create);
const mockLikeFind = jest.mocked(likeRepository.find);
const mockLikeDelete = jest.mocked(likeRepository.delete);
const mockFindByUserId = jest.mocked(likeRepository.findByUserId);

const mockFindProjectForUpdate = jest.mocked(
  projectRepository.findByIdForUpdate,
);

describe("like service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("addLikeService", () => {
    it("creates a like and increments the project's like count", async () => {
      const like = {
        userId: "user-123",
        projectId: "project-123",
      };

      const project = {
        get: jest.fn().mockReturnValue(5),
        set: jest.fn(),
        save: jest.fn<() => Promise<void>>().mockResolvedValue(undefined),
      };

      mockLikeFind.mockResolvedValue(null);
      mockFindProjectForUpdate.mockResolvedValue(project as never);
      mockLikeCreate.mockResolvedValue(like as never);

      const result = await addLikeService("user-123", "project-123");

      expect(mockLikeFind).toHaveBeenCalledWith("user-123", "project-123");

      expect(mockFindProjectForUpdate).toHaveBeenCalledWith("project-123");

      expect(mockLikeCreate).toHaveBeenCalledWith("user-123", "project-123");

      expect(project.get).toHaveBeenCalledWith("stats.likes");

      expect(project.set).toHaveBeenCalledWith("stats.likes", 6);

      expect(project.save).toHaveBeenCalled();

      expect(result).toBe(like);
    });

    it("rejects an already liked project", async () => {
      mockLikeFind.mockResolvedValue({
        userId: "user-123",
        projectId: "project-123",
      } as never);

      await expect(
        addLikeService("user-123", "project-123"),
      ).rejects.toMatchObject({
        message: "Project already liked.",
        statusCode: 409,
      });

      expect(mockFindProjectForUpdate).not.toHaveBeenCalled();

      expect(mockLikeCreate).not.toHaveBeenCalled();
    });

    it("rejects when the project does not exist", async () => {
      mockLikeFind.mockResolvedValue(null);
      mockFindProjectForUpdate.mockResolvedValue(null);

      await expect(
        addLikeService("user-123", "project-123"),
      ).rejects.toMatchObject({
        message: "Project not found.",
        statusCode: 404,
      });

      expect(mockLikeCreate).not.toHaveBeenCalled();
    });
  });

  describe("removeLikeService", () => {
    it("removes a like and decrements the project's like count", async () => {
      const like = {
        userId: "user-123",
        projectId: "project-123",
      };

      const project = {
        get: jest.fn().mockReturnValue(5),
        set: jest.fn(),
        save: jest.fn<() => Promise<void>>().mockResolvedValue(undefined),
      };

      mockLikeDelete.mockResolvedValue(like as never);
      mockFindProjectForUpdate.mockResolvedValue(project as never);

      const result = await removeLikeService("user-123", "project-123");

      expect(mockLikeDelete).toHaveBeenCalledWith("user-123", "project-123");

      expect(mockFindProjectForUpdate).toHaveBeenCalledWith("project-123");

      expect(project.get).toHaveBeenCalledWith("stats.likes");

      expect(project.set).toHaveBeenCalledWith("stats.likes", 4);

      expect(project.save).toHaveBeenCalled();

      expect(result).toBe(like);
    });

    it("rejects when the like does not exist", async () => {
      mockLikeDelete.mockResolvedValue(null);

      await expect(
        removeLikeService("user-123", "project-123"),
      ).rejects.toMatchObject({
        message: "Like not found.",
        statusCode: 404,
      });

      expect(mockFindProjectForUpdate).not.toHaveBeenCalled();
    });

    it("does not decrement below zero", async () => {
      const like = {
        userId: "user-123",
        projectId: "project-123",
      };

      const project = {
        get: jest.fn().mockReturnValue(0),
        set: jest.fn(),
        save: jest.fn<() => Promise<void>>().mockResolvedValue(undefined),
      };

      mockLikeDelete.mockResolvedValue(like as never);
      mockFindProjectForUpdate.mockResolvedValue(project as never);

      await removeLikeService("user-123", "project-123");

      expect(project.set).not.toHaveBeenCalled();

      expect(project.save).not.toHaveBeenCalled();
    });
  });

  describe("getLikesService", () => {
    it("returns the project IDs liked by the user", async () => {
      mockFindByUserId.mockResolvedValue([
        {
          projectId: "project-1",
        },
        {
          projectId: "project-2",
        },
      ] as never);

      const result = await getLikesService("user-123");

      expect(mockFindByUserId).toHaveBeenCalledWith("user-123");

      expect(result).toEqual(["project-1", "project-2"]);
    });
  });
});

/*
Test coverage:

1. Adds a like and increments the count
   → Verifies an existing like is checked, the project is retrieved,
     the like is created, and stats.likes is incremented and saved.

2. Rejects duplicate likes
   → Verifies a 409 AppError is thrown and no project update or like
     creation occurs when the user has already liked the project.

3. Rejects a missing project when liking
   → Verifies a 404 AppError is thrown when the project cannot be found.

4. Removes a like and decrements the count
   → Verifies the like is deleted and the project's like count is
     decreased by one.

5. Rejects a missing like
   → Verifies a 404 AppError is thrown when there is no like to remove.

6. Prevents the like count from going below zero
   → Verifies the project is not modified when its current like count
     is already zero.

7. Gets the user's liked projects
   → Verifies the service converts like records into project IDs.
*/
