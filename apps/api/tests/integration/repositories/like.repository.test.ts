import { beforeEach, describe, expect, it, jest } from "@jest/globals";

import Like from "../../../src/models/like.model";

import { likeRepository } from "../../../src/repositories/like.repository";

jest.mock("../../../src/models/like.model", () => ({
  __esModule: true,
  default: {
    create: jest.fn(),
    findOne: jest.fn(),
    findOneAndDelete: jest.fn(),
    find: jest.fn(),
  },
}));

const mockCreate = jest.mocked(Like.create);
const mockFindOne = jest.mocked(Like.findOne);
const mockFindOneAndDelete = jest.mocked(Like.findOneAndDelete);
const mockFind = jest.mocked(Like.find);

describe("like repository", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("creates a like for a user and project", async () => {
      const like = {
        userId: "user-123",
        projectId: "project-123",
      };

      mockCreate.mockResolvedValue(like as never);

      const result = await likeRepository.create("user-123", "project-123");

      expect(mockCreate).toHaveBeenCalledWith({
        userId: "user-123",
        projectId: "project-123",
      });

      expect(result).toBe(like);
    });
  });

  describe("find", () => {
    it("finds a like for a user and project", async () => {
      const like = {
        userId: "user-123",
        projectId: "project-123",
      };

      mockFindOne.mockResolvedValue(like as never);

      const result = await likeRepository.find("user-123", "project-123");

      expect(mockFindOne).toHaveBeenCalledWith({
        userId: "user-123",
        projectId: "project-123",
      });

      expect(result).toBe(like);
    });
  });

  describe("delete", () => {
    it("deletes a like for a user and project", async () => {
      const like = {
        userId: "user-123",
        projectId: "project-123",
      };

      mockFindOneAndDelete.mockResolvedValue(like as never);

      const result = await likeRepository.delete("user-123", "project-123");

      expect(mockFindOneAndDelete).toHaveBeenCalledWith({
        userId: "user-123",
        projectId: "project-123",
      });

      expect(result).toBe(like);
    });
  });

  describe("findByUserId", () => {
    it("finds a user's likes with populated project and creator data", async () => {
      const likes = [
        {
          userId: "user-123",
          projectId: {
            title: "BuildKiwi",
            creatorId: {
              username: "aditya",
              avatarSeed: "avatar-seed-123",
              avatarPattern: "blobs",
            },
          },
        },
      ];

      const sort =
        jest.fn<(options: { createdAt: -1 }) => Promise<typeof likes>>();

      sort.mockResolvedValue(likes);

      const populate = jest.fn().mockReturnValue({
        sort,
      });

      mockFind.mockReturnValue({
        populate,
      } as unknown as ReturnType<typeof Like.find>);

      const result = await likeRepository.findByUserId("user-123");

      expect(mockFind).toHaveBeenCalledWith({
        userId: "user-123",
      });

      expect(populate).toHaveBeenCalledWith({
        path: "projectId",
        select:
          "title description tags coverImage links stats creatorId createdAt updatedAt",
        populate: {
          path: "creatorId",
          select: "username avatarSeed avatarPattern",
        },
      });

      expect(sort).toHaveBeenCalledWith({
        createdAt: -1,
      });

      expect(result).toBe(likes);
    });
  });
});

/*
Test coverage:

1. Creates a like
   → Verifies the repository passes the correct user and project IDs
     to Like.create().

2. Finds a like
   → Verifies Like.findOne() receives the correct user and project
     filters.

3. Deletes a like
   → Verifies Like.findOneAndDelete() receives the correct filters.

4. Finds a user's likes
   → Verifies likes are filtered by user, project information is
     populated, creator information is populated with username,
     avatarSeed, and avatarPattern, and results are sorted by
     newest like first.
*/
