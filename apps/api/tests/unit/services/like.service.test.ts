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
    find: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    findByUserId: jest.fn(),
  },
}));

jest.mock("../../../src/repositories/project.repository", () => ({
  projectRepository: {
    findByIdForUpdate: jest.fn(),
  },
}));

const mockFindLike = jest.mocked(likeRepository.find);
const mockCreateLike = jest.mocked(likeRepository.create);
const mockDeleteLike = jest.mocked(likeRepository.delete);
const mockFindLikesByUser = jest.mocked(likeRepository.findByUserId);
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
        save: jest.fn().mockResolvedValue(undefined as never),
      };

      mockFindLike.mockResolvedValue(null);
      mockFindProjectForUpdate.mockResolvedValue(project as never);
      mockCreateLike.mockResolvedValue(like as never);

      const result = await addLikeService("user-123", "project-123");

      expect(mockFindLike).toHaveBeenCalledWith("user-123", "project-123");

      expect(mockFindProjectForUpdate).toHaveBeenCalledWith("project-123");

      expect(mockCreateLike).toHaveBeenCalledWith("user-123", "project-123");

      expect(project.set).toHaveBeenCalledWith("stats.likes", 6);
      expect(project.save).toHaveBeenCalled();

      expect(result).toBe(like);
    });

    it("rejects an existing like", async () => {
      mockFindLike.mockResolvedValue({
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
      expect(mockCreateLike).not.toHaveBeenCalled();
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
        save: jest.fn().mockResolvedValue(undefined as never), //fix this never
      };

      mockDeleteLike.mockResolvedValue(like as never);
      mockFindProjectForUpdate.mockResolvedValue(project as never);

      const result = await removeLikeService("user-123", "project-123");

      expect(mockDeleteLike).toHaveBeenCalledWith("user-123", "project-123");

      expect(mockFindProjectForUpdate).toHaveBeenCalledWith("project-123");

      expect(project.set).toHaveBeenCalledWith("stats.likes", 4);
      expect(project.save).toHaveBeenCalled();

      expect(result).toBe(like);
    });

    it("rejects removing a like that does not exist", async () => {
      mockDeleteLike.mockResolvedValue(null);

      await expect(
        removeLikeService("user-123", "project-123"),
      ).rejects.toMatchObject({
        message: "Like not found.",
        statusCode: 404,
      });

      expect(mockFindProjectForUpdate).not.toHaveBeenCalled();
    });
  });

  describe("getLikesService", () => {
    it("returns the project IDs liked by the user", async () => {
      mockFindLikesByUser.mockResolvedValue([
        { projectId: "project-1" },
        { projectId: "project-2" },
      ] as never);

      const result = await getLikesService("user-123");

      expect(mockFindLikesByUser).toHaveBeenCalledWith("user-123");
      expect(result).toEqual(["project-1", "project-2"]);
    });
  });
});

/*
Test coverage:

1. Creates a like and increments the project's like count
   → Verifies a valid like is created and the project's stats.likes
     value is incremented and saved.

2. Rejects an existing like
   → Verifies duplicate likes return a 409 error and no project
     update or new like is created.

3. Removes a like and decrements the project's like count
   → Verifies an existing like is removed and the project's like
     count is decremented and saved.

4. Rejects removing a missing like
   → Verifies removing a like that does not exist returns a 404 error
     and does not attempt to update the project.

5. Returns the user's liked project IDs
   → Verifies like documents are transformed into the list of project
     IDs expected by the caller.
*/
