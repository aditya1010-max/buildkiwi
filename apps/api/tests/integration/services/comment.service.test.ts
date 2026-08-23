import { beforeEach, describe, expect, it, jest } from "@jest/globals";

import {
  createCommentRepository,
  getCommentsByProjectRepository,
} from "../../../src/repositories/comment.repository";

import {
  createCommentService,
  getCommentsByProjectService,
} from "../../../src/services/comment.service";

jest.mock("../../../src/repositories/comment.repository", () => ({
  createCommentRepository: jest.fn(),
  getCommentsByProjectRepository: jest.fn(),
}));

const mockCreateComment = jest.mocked(createCommentRepository);
const mockGetCommentsByProject = jest.mocked(getCommentsByProjectRepository);

describe("comment service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createCommentService", () => {
    it("creates a comment with the provided project, user, and content", async () => {
      const comment = {
        _id: "comment-123",
        projectId: "project-123",
        userId: "user-123",
        content: "Great project!",
      };

      mockCreateComment.mockResolvedValue(comment as never);

      const result = await createCommentService(
        "project-123",
        "user-123",
        "Great project!",
      );

      expect(mockCreateComment).toHaveBeenCalledWith({
        projectId: "project-123",
        userId: "user-123",
        content: "Great project!",
      });

      expect(result).toBe(comment);
    });
  });

  describe("getCommentsByProjectService", () => {
    it("returns comments for the requested project", async () => {
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

      mockGetCommentsByProject.mockResolvedValue(comments as never);

      const result = await getCommentsByProjectService("project-123");

      expect(mockGetCommentsByProject).toHaveBeenCalledWith("project-123");

      expect(result).toBe(comments);
    });
  });
});

/*
Test coverage:

1. Creates a comment
   → Verifies the service passes the project ID, user ID, and content
     to the comment repository.

2. Gets comments by project
   → Verifies the service requests comments for the specified project
     and returns the repository result.
*/
