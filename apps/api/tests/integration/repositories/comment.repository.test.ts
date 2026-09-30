import { beforeEach, describe, expect, it, jest } from "@jest/globals";

import { Comment } from "../../../src/models/comment.model";

import {
  createCommentRepository,
  getCommentsByProjectRepository,
} from "../../../src/repositories/comment.repository";

jest.mock("../../../src/models/comment.model", () => ({
  Comment: {
    create: jest.fn(),
    findById: jest.fn(),
    find: jest.fn(),
    countDocuments: jest.fn(),
    findByIdAndDelete: jest.fn(),
  },
}));

const mockCreate = jest.mocked(Comment.create);
const mockFindById = jest.mocked(Comment.findById);
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

      const lean = jest
        .fn<() => Promise<typeof comment>>()
        .mockResolvedValue(comment);

      const populate = jest.fn().mockReturnValue({
        lean,
      });

      mockCreate.mockResolvedValue(comment as never);

      mockFindById.mockReturnValue({
        populate,
      } as never);

      const result = await createCommentRepository(data);

      expect(mockCreate).toHaveBeenCalledWith(data);

      expect(mockFindById).toHaveBeenCalledWith(comment._id);

      expect(populate).toHaveBeenCalledWith(
        "userId",
        "username avatarSeed avatarPattern",
      );

      expect(lean).toHaveBeenCalled();

      expect(result).toBe(comment);
    });
  });

  describe("getCommentsByProjectRepository", () => {
    it("gets comments by project with pagination and newest first", async () => {
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

      const lean = jest
        .fn<() => Promise<typeof comments>>()
        .mockResolvedValue(comments);

      const limit = jest.fn().mockReturnValue({
        lean,
      });

      const skip = jest.fn().mockReturnValue({
        limit,
      });

      const sort = jest.fn().mockReturnValue({
        skip,
      });

      const populate = jest.fn().mockReturnValue({
        sort,
      });

      mockFind.mockReturnValue({
        populate,
      } as unknown as ReturnType<typeof Comment.find>);

      const result = await getCommentsByProjectRepository("project-123", 1, 10);

      expect(mockFind).toHaveBeenCalledWith({
        projectId: "project-123",
      });

      expect(populate).toHaveBeenCalledWith(
        "userId",
        "username avatarSeed avatarPattern",
      );

      expect(sort).toHaveBeenCalledWith({
        createdAt: -1,
      });

      expect(skip).toHaveBeenCalledWith(0);
      expect(limit).toHaveBeenCalledWith(10);

      expect(lean).toHaveBeenCalled();

      expect(result).toBe(comments);
    });
  });
});

/*
Test coverage:

1. Creates a comment with the provided data
   → Verifies the repository passes the comment data to
     Comment.create(), then finds the created comment,
     populates the author, and returns the result.

2. Gets comments by project
   → Verifies comments are filtered by project ID, the
     comment author's profile fields are populated, sorted
     newest first, paginated, and returned.
*/
