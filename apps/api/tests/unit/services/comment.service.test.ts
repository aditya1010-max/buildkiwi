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
      mockProjectRepository.incrementCommentCount.mockResolvedValue(
        project as never,
      );

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
  });

  describe("getCommentsService", () => {
    it("returns paginated comments for a project", async () => {
      const project = {
        _id: "project-123",
      };

      const comments = [
        {
          _id: "comment-1",
          projectId: "project-123",
          content: "Great project!",
        },
        {
          _id: "comment-2",
          projectId: "project-123",
          content: "Looks good!",
        },
      ];

      mockProjectRepository.findById.mockResolvedValue(project as never);

      mockGetCommentsByProject.mockResolvedValue(comments as never);

      mockCountComments.mockResolvedValue(12);

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
          total: 12,
          page: 1,
          limit: 10,
          totalPages: 2,
          hasMore: true,
        },
      });
    });
  });
});
