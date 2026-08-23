import { beforeEach, describe, expect, it, jest } from "@jest/globals";

import { bookmarkRepository } from "../../../src/repositories/bookmark.repository";
import { projectRepository } from "../../../src/repositories/project.repository";

import {
  addBookmarkService,
  removeBookmarkService,
  getBookmarksService,
} from "../../../src/services/bookmark.service";

jest.mock("../../../src/repositories/bookmark.repository", () => ({
  bookmarkRepository: {
    create: jest.fn(),
    find: jest.fn(),
    delete: jest.fn(),
    findByUserId: jest.fn(),
  },
}));

jest.mock("../../../src/repositories/project.repository", () => ({
  projectRepository: {
    findById: jest.fn(),
  },
}));

const mockBookmarkCreate = jest.mocked(bookmarkRepository.create);
const mockBookmarkFind = jest.mocked(bookmarkRepository.find);
const mockBookmarkDelete = jest.mocked(bookmarkRepository.delete);
const mockFindByUserId = jest.mocked(bookmarkRepository.findByUserId);

const mockProjectFindById = jest.mocked(projectRepository.findById);

describe("bookmark service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("addBookmarkService", () => {
    it("creates a bookmark when the project exists and is not already bookmarked", async () => {
      const project = {
        _id: "project-123",
      };

      const bookmark = {
        userId: "user-123",
        projectId: "project-123",
      };

      mockProjectFindById.mockResolvedValue(project as never);
      mockBookmarkFind.mockResolvedValue(null);
      mockBookmarkCreate.mockResolvedValue(bookmark as never);

      const result = await addBookmarkService("user-123", "project-123");

      expect(mockProjectFindById).toHaveBeenCalledWith("project-123");

      expect(mockBookmarkFind).toHaveBeenCalledWith("user-123", "project-123");

      expect(mockBookmarkCreate).toHaveBeenCalledWith(
        "user-123",
        "project-123",
      );

      expect(result).toBe(bookmark);
    });

    it("throws when the project does not exist", async () => {
      mockProjectFindById.mockResolvedValue(null);

      await expect(
        addBookmarkService("user-123", "project-123"),
      ).rejects.toMatchObject({
        message: "Project not found.",
        statusCode: 404,
      });

      expect(mockBookmarkFind).not.toHaveBeenCalled();
      expect(mockBookmarkCreate).not.toHaveBeenCalled();
    });

    it("throws when the project is already bookmarked", async () => {
      mockProjectFindById.mockResolvedValue({
        _id: "project-123",
      } as never);

      mockBookmarkFind.mockResolvedValue({
        userId: "user-123",
        projectId: "project-123",
      } as never);

      await expect(
        addBookmarkService("user-123", "project-123"),
      ).rejects.toMatchObject({
        message: "Project already bookmarked.",
        statusCode: 409,
      });

      expect(mockBookmarkCreate).not.toHaveBeenCalled();
    });
  });

  describe("removeBookmarkService", () => {
    it("removes an existing bookmark", async () => {
      const bookmark = {
        userId: "user-123",
        projectId: "project-123",
      };

      mockBookmarkDelete.mockResolvedValue(bookmark as never);

      const result = await removeBookmarkService("user-123", "project-123");

      expect(mockBookmarkDelete).toHaveBeenCalledWith(
        "user-123",
        "project-123",
      );

      expect(result).toBe(bookmark);
    });

    it("throws when the bookmark does not exist", async () => {
      mockBookmarkDelete.mockResolvedValue(null);

      await expect(
        removeBookmarkService("user-123", "project-123"),
      ).rejects.toMatchObject({
        message: "Bookmark not found.",
        statusCode: 404,
      });
    });
  });

  describe("getBookmarksService", () => {
    it("returns project IDs from the user's bookmarks", async () => {
      mockFindByUserId.mockResolvedValue([
        {
          projectId: "project-1",
        },
        {
          projectId: "project-2",
        },
      ] as never);

      const result = await getBookmarksService("user-123");

      expect(mockFindByUserId).toHaveBeenCalledWith("user-123");

      expect(result).toEqual(["project-1", "project-2"]);
    });
  });
});

/*
Test coverage:

1. Creates a bookmark
   → Verifies a bookmark is created when the project exists and the
     user has not already bookmarked it.

2. Rejects a missing project
   → Verifies a 404 AppError is thrown and no bookmark lookup or
     creation occurs.

3. Rejects a duplicate bookmark
   → Verifies a 409 AppError is thrown when the bookmark already exists.

4. Removes a bookmark
   → Verifies an existing bookmark is deleted and returned.

5. Rejects a missing bookmark
   → Verifies a 404 AppError is thrown when there is nothing to remove.

6. Gets bookmarked project IDs
   → Verifies the service converts bookmark documents into an array
     containing only their project IDs.
*/
