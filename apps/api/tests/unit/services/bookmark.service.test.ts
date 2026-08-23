import { beforeEach, describe, expect, it, jest } from "@jest/globals";

import { bookmarkRepository } from "../../../src/repositories/bookmark.repository";
import { projectRepository } from "../../../src/repositories/project.repository";
import { AppError } from "../../../src/utils/AppError";

import {
  addBookmarkService,
  removeBookmarkService,
  getBookmarksService,
} from "../../../src/services/bookmark.service";

jest.mock("../../../src/repositories/bookmark.repository", () => ({
  bookmarkRepository: {
    find: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    findByUserId: jest.fn(),
  },
}));

jest.mock("../../../src/repositories/project.repository", () => ({
  projectRepository: {
    findById: jest.fn(),
  },
}));

const mockFindProject = jest.mocked(projectRepository.findById);
const mockFindBookmark = jest.mocked(bookmarkRepository.find);
const mockCreateBookmark = jest.mocked(bookmarkRepository.create);
const mockDeleteBookmark = jest.mocked(bookmarkRepository.delete);
const mockFindBookmarksByUser = jest.mocked(bookmarkRepository.findByUserId);

describe("bookmark service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("addBookmarkService", () => {
    it("creates a bookmark when the project exists and is not already bookmarked", async () => {
      const bookmark = {
        userId: "user-123",
        projectId: "project-123",
      };

      mockFindProject.mockResolvedValue({ _id: "project-123" } as never);
      mockFindBookmark.mockResolvedValue(null);
      mockCreateBookmark.mockResolvedValue(bookmark as never);

      const result = await addBookmarkService("user-123", "project-123");

      expect(mockFindProject).toHaveBeenCalledWith("project-123");
      expect(mockFindBookmark).toHaveBeenCalledWith("user-123", "project-123");
      expect(mockCreateBookmark).toHaveBeenCalledWith(
        "user-123",
        "project-123",
      );

      expect(result).toBe(bookmark);
    });

    it("throws when the project does not exist", async () => {
      mockFindProject.mockResolvedValue(null);

      await expect(
        addBookmarkService("user-123", "project-123"),
      ).rejects.toEqual(new AppError("Project not found.", 404));

      expect(mockFindBookmark).not.toHaveBeenCalled();
      expect(mockCreateBookmark).not.toHaveBeenCalled();
    });

    it("throws when the project is already bookmarked", async () => {
      mockFindProject.mockResolvedValue({ _id: "project-123" } as never);
      mockFindBookmark.mockResolvedValue({
        userId: "user-123",
        projectId: "project-123",
      } as never);

      await expect(
        addBookmarkService("user-123", "project-123"),
      ).rejects.toEqual(new AppError("Project already bookmarked.", 409));

      expect(mockCreateBookmark).not.toHaveBeenCalled();
    });
  });

  describe("removeBookmarkService", () => {
    it("deletes and returns an existing bookmark", async () => {
      const bookmark = {
        userId: "user-123",
        projectId: "project-123",
      };

      mockDeleteBookmark.mockResolvedValue(bookmark as never);

      const result = await removeBookmarkService("user-123", "project-123");

      expect(mockDeleteBookmark).toHaveBeenCalledWith(
        "user-123",
        "project-123",
      );

      expect(result).toBe(bookmark);
    });

    it("throws when the bookmark does not exist", async () => {
      mockDeleteBookmark.mockResolvedValue(null);

      await expect(
        removeBookmarkService("user-123", "project-123"),
      ).rejects.toEqual(new AppError("Bookmark not found.", 404));
    });
  });

  describe("getBookmarksService", () => {
    it("returns the project IDs from the user's bookmarks", async () => {
      mockFindBookmarksByUser.mockResolvedValue([
        { projectId: "project-1" },
        { projectId: "project-2" },
      ] as never);

      const result = await getBookmarksService("user-123");

      expect(mockFindBookmarksByUser).toHaveBeenCalledWith("user-123");
      expect(result).toEqual(["project-1", "project-2"]);
    });
  });
});

/*
Test coverage:

1. Creates a bookmark for a valid project
   → Verifies an existing project that is not already bookmarked is
     successfully passed to the bookmark repository for creation.

2. Rejects bookmarking a missing project
   → Verifies the service returns a 404 AppError and does not attempt
     to check or create a bookmark.

3. Rejects an existing bookmark
   → Verifies duplicate bookmarks return a 409 AppError and no new
     bookmark is created.

4. Deletes an existing bookmark
   → Verifies the repository is called with the correct user and
     project IDs and its result is returned.

5. Rejects deleting a missing bookmark
   → Verifies attempting to remove a non-existent bookmark produces
     a 404 AppError.

6. Returns the user's bookmarked project IDs
   → Verifies bookmark documents are transformed into the list of
     project IDs expected by the caller.
*/
