import { beforeEach, describe, expect, it, jest } from "@jest/globals";

import { Comment } from "../../../src/models/comment.model";

import {
  createCommentRepository,
  getCommentsByProjectRepository,
} from "../../../src/repositories/comment.repository";

jest.mock("../../../src/models/comment.model", () => ({
  Comment: {
    create: jest.fn(),
    find: jest.fn(),
  },
}));

const mockCreate = jest.mocked(Comment.create);
const mockFind = jest.mocked(Comment.find);

describe("comment repository", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createCommentRepository", () => {
    it("creates a comment with the provided data", async () => {
      const data = {
        projectId: "project-123",
        userId: "user-123",
        content: "Great project!",
      };

      const comment = {
        _id: "comment-123",
        ...data,
      };

      mockCreate.mockResolvedValue(comment as never);

      const result = await createCommentRepository(data);

      expect(mockCreate).toHaveBeenCalledWith(data);
      expect(result).toBe(comment);
    });
  });

  describe("getCommentsByProjectRepository", () => {
    it("gets project comments populated with users and sorted by newest first", async () => {
      const comments = [
        {
          _id: "comment-1",
          content: "Latest comment",
        },
        {
          _id: "comment-2",
          content: "Older comment",
        },
      ];

      const sort =
        jest.fn<(options: { createdAt: -1 }) => Promise<typeof comments>>();

      sort.mockResolvedValue(comments);

      const populate = jest.fn().mockReturnValue({
        sort,
      });

      mockFind.mockReturnValue({
        populate,
      } as unknown as ReturnType<typeof Comment.find>);

      const result = await getCommentsByProjectRepository("project-123");

      expect(mockFind).toHaveBeenCalledWith({
        projectId: "project-123",
      });

      expect(populate).toHaveBeenCalledWith("userId", "username");

      expect(sort).toHaveBeenCalledWith({
        createdAt: -1,
      });

      expect(result).toBe(comments);
    });
  });
});

/*
Test coverage:

1. Creates a comment with the provided data
   → Verifies the repository passes the comment data directly to
     Comment.create() and returns the created comment.

2. Gets comments by project
   → Verifies comments are filtered by project ID, the comment author's
     username is populated, and comments are sorted newest first.
*/
