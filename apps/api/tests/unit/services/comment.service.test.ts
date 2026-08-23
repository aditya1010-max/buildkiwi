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
    it("creates a comment with the provided data", async () => {
      const comment = {
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
    it("returns comments for the provided project", async () => {
      const comments = [
        {
          projectId: "project-123",
          userId: "user-123",
          content: "Great project!",
        },
        {
          projectId: "project-123",
          userId: "user-456",
          content: "Nice work!",
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

1. Creates a comment with the provided data
   → Verifies the service passes the project ID, user ID, and content
     correctly to the comment repository and returns its result.

2. Returns comments for the provided project
   → Verifies the service requests comments for the correct project and
     returns the repository result unchanged.
*/
