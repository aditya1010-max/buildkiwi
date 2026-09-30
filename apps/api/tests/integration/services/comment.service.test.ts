import { beforeEach, describe, expect, it, jest } from "@jest/globals";

import {
  countCommentsByProjectRepository,
  createCommentRepository,
  getCommentsByProjectRepository,
} from "../../../src/repositories/comment.repository";

import { projectRepository } from "../../../src/repositories/project.repository";

import {
  createCommentService,
  getCommentsService,
} from "../../../src/services/comment.service";

jest.mock("../../../src/repositories/comment.repository", () => ({
  countCommentsByProjectRepository: jest.fn(),
  createCommentRepository: jest.fn(),
  getCommentsByProjectRepository: jest.fn(),
}));

jest.mock("../../../src/repositories/project.repository", () => ({
  projectRepository: {
    findById: jest.fn(),
    findByIdForUpdate: jest.fn(),
    incrementCommentCount: jest.fn(),
  },
}));

const mockCreateComment = jest.mocked(createCommentRepository);

const mockGetCommentsByProject = jest.mocked(getCommentsByProjectRepository);

const mockCountComments = jest.mocked(countCommentsByProjectRepository);

const mockProjectRepository = jest.mocked(projectRepository);

describe("comment service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createCommentService", () => {
    it("creates a comment and increments the project count", async () => {
      const project = {
        _id: "project-123",
      };

      const comment = {
        _id: "comment-123",
        projectId: "project-123",
        userId: "user-123",
        content: "Great project!",
      };

      mockProjectRepository.findByIdForUpdate.mockResolvedValue(
        project as never,
      );

      mockCreateComment.mockResolvedValue(comment as never);

      const result = await createCommentService("project-123", "user-123", {
        content: "Great project!",
      });

      expect(mockProjectRepository.findByIdForUpdate).toHaveBeenCalledWith(
        "project-123",
      );

      expect(mockCreateComment).toHaveBeenCalledWith({
        projectId: "project-123",
        userId: "user-123",
        content: "Great project!",
      });

      expect(mockProjectRepository.incrementCommentCount).toHaveBeenCalledWith(
        "project-123",
      );

      expect(result).toBe(comment);
    });

    it("throws when the project does not exist", async () => {
      mockProjectRepository.findByIdForUpdate.mockResolvedValue(null);

      await expect(
        createCommentService("project-123", "user-123", {
          content: "Great project!",
        }),
      ).rejects.toThrow("Project not found");

      expect(mockCreateComment).not.toHaveBeenCalled();

      expect(
        mockProjectRepository.incrementCommentCount,
      ).not.toHaveBeenCalled();
    });
  });

  describe("getCommentsService", () => {
    it("gets paginated comments", async () => {
      const project = {
        _id: "project-123",
      };

      const comments = [
        {
          _id: "comment-1",
          projectId: "project-123",
          content: "Great project!",
        },
      ];

      mockProjectRepository.findById.mockResolvedValue(project as never);

      mockGetCommentsByProject.mockResolvedValue(comments as never);

      mockCountComments.mockResolvedValue(1);

      const result = await getCommentsService("project-123", 1, 10);

      expect(mockProjectRepository.findById).toHaveBeenCalledWith(
        "project-123",
      );

      expect(mockGetCommentsByProject).toHaveBeenCalledWith(
        "project-123",
        1,
        10,
      );

      expect(mockCountComments).toHaveBeenCalledWith("project-123");

      expect(result).toEqual({
        comments,
        pagination: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
          hasMore: false,
        },
      });
    });

    it("throws when the project does not exist", async () => {
      mockProjectRepository.findById.mockResolvedValue(null);

      await expect(getCommentsService("project-123", 1, 10)).rejects.toThrow(
        "Project not found",
      );

      expect(mockGetCommentsByProject).not.toHaveBeenCalled();

      expect(mockCountComments).not.toHaveBeenCalled();
    });
  });
});
