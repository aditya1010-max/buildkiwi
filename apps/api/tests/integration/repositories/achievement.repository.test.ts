import { beforeEach, describe, expect, it, jest } from "@jest/globals";

import { UserAchievement } from "../../../src/models/userAchievement.model";

import {
  findUserAchievement,
  createUserAchievement,
  getRecentAchievements,
} from "../../../src/repositories/achievement.repository";

jest.mock("../../../src/models/userAchievement.model", () => ({
  UserAchievement: {
    findOne: jest.fn(),
    create: jest.fn(),
    find: jest.fn(),
  },
}));

const mockFindOne = jest.mocked(UserAchievement.findOne);
const mockCreate = jest.mocked(UserAchievement.create);
const mockFind = jest.mocked(UserAchievement.find);

describe("achievement repository", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("findUserAchievement", () => {
    it("finds an achievement for a user", async () => {
      const achievement = {
        userId: "user-123",
        achievementKey: "FIRST_PROJECT",
      };

      const lean = jest.fn<() => Promise<typeof achievement>>();
      lean.mockResolvedValue(achievement);

      mockFindOne.mockReturnValue({
        lean,
      } as unknown as ReturnType<typeof UserAchievement.findOne>);

      const result = await findUserAchievement("user-123", "FIRST_PROJECT");

      expect(mockFindOne).toHaveBeenCalledWith({
        userId: "user-123",
        achievementKey: "FIRST_PROJECT",
      });

      expect(lean).toHaveBeenCalled();
      expect(result).toBe(achievement);
    });
  });

  describe("createUserAchievement", () => {
    it("creates an achievement for a user", async () => {
      const achievement = {
        userId: "user-123",
        achievementKey: "FIRST_PROJECT",
        earnedAt: new Date(),
      };

      mockCreate.mockResolvedValue(achievement as never);

      const result = await createUserAchievement("user-123", "FIRST_PROJECT");

      expect(mockCreate).toHaveBeenCalledWith({
        userId: "user-123",
        achievementKey: "FIRST_PROJECT",
      });

      expect(result).toBe(achievement);
    });
  });

  describe("getRecentAchievements", () => {
    describe("getRecentAchievements", () => {
      it("gets recent achievements ordered by earned date", async () => {
        const achievements = [
          {
            userId: {
              _id: "user-123",
              username: "aditya",
            },
            achievementKey: "FIRST_PROJECT",
          },
        ];

        const lean = jest.fn<() => Promise<typeof achievements>>();
        lean.mockResolvedValue(achievements);

        const populate = jest.fn().mockReturnValue({
          lean,
        });

        const limit = jest.fn().mockReturnValue({
          populate,
        });

        const sort = jest.fn().mockReturnValue({
          limit,
        });

        mockFind.mockReturnValue({
          sort,
        } as unknown as ReturnType<typeof UserAchievement.find>);

        const result = await getRecentAchievements(5);

        expect(mockFind).toHaveBeenCalledWith();

        expect(sort).toHaveBeenCalledWith({
          earnedAt: -1,
        });

        expect(limit).toHaveBeenCalledWith(5);

        expect(populate).toHaveBeenCalledWith("userId", "username");

        expect(lean).toHaveBeenCalled();

        expect(result).toBe(achievements);
      });
    });
  });
});

/*
Test coverage:

1. Finds a user's achievement
   → Verifies the repository queries UserAchievement with the correct
     user ID and achievement key and calls lean().

2. Creates a user achievement
   → Verifies the repository passes the correct user ID and achievement
     key to UserAchievement.create().

3. Gets recent achievements
   → Verifies achievements are sorted by earnedAt descending, limited
     to the requested amount, populated with the user's username, and
     converted to lean objects.
*/
