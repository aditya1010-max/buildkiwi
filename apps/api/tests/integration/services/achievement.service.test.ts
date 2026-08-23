import { beforeEach, describe, expect, it, jest } from "@jest/globals";

import {
  findUserAchievement,
  createUserAchievement,
  getRecentAchievements,
} from "../../../src/repositories/achievement.repository";

import {
  checkFirstProject,
  getRecentAchievementActivity,
} from "../../../src/services/achievement.service";

jest.mock("../../../src/repositories/achievement.repository", () => ({
  findUserAchievement: jest.fn(),
  createUserAchievement: jest.fn(),
  getRecentAchievements: jest.fn(),
}));

const mockFindUserAchievement = jest.mocked(findUserAchievement);
const mockCreateUserAchievement = jest.mocked(createUserAchievement);
const mockGetRecentAchievements = jest.mocked(getRecentAchievements);

describe("achievement service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("checkFirstProject", () => {
    it("creates the first project achievement when the user has not earned it", async () => {
      mockFindUserAchievement.mockResolvedValue(null);
      mockCreateUserAchievement.mockResolvedValue({} as never);

      const result = await checkFirstProject("user-123");

      expect(mockFindUserAchievement).toHaveBeenCalledWith(
        "user-123",
        "FIRST_PROJECT",
      );

      expect(mockCreateUserAchievement).toHaveBeenCalledWith(
        "user-123",
        "FIRST_PROJECT",
      );

      expect(result).toEqual({
        key: "FIRST_PROJECT",
        name: "First Spark",
        description: "Published your first project",
        image: "/achievements/first-spark.webp",
      });
    });

    it("returns null when the user already has the achievement", async () => {
      mockFindUserAchievement.mockResolvedValue({} as never);

      const result = await checkFirstProject("user-123");

      expect(mockFindUserAchievement).toHaveBeenCalledWith(
        "user-123",
        "FIRST_PROJECT",
      );

      expect(mockCreateUserAchievement).not.toHaveBeenCalled();

      expect(result).toBeNull();
    });
  });

  describe("getRecentAchievementActivity", () => {
    it("returns recent achievements with usernames", async () => {
      const earnedAt = new Date();

      mockGetRecentAchievements.mockResolvedValue([
        {
          userId: {
            _id: "user-123",
            username: "aditya",
          },
          achievementKey: "FIRST_PROJECT",
          earnedAt,
        },
      ] as never);

      const result = await getRecentAchievementActivity(5);

      expect(mockGetRecentAchievements).toHaveBeenCalledWith(5);

      expect(result).toEqual([
        {
          username: "aditya",
          achievement: expect.anything(),
          earnedAt,
        },
      ]);
    });

    it("uses the default limit when no limit is provided", async () => {
      mockGetRecentAchievements.mockResolvedValue([] as never);

      await getRecentAchievementActivity();

      expect(mockGetRecentAchievements).toHaveBeenCalledWith(10);
    });

    it("uses Unknown builder when the achievement has no populated user", async () => {
      const earnedAt = new Date();

      mockGetRecentAchievements.mockResolvedValue([
        {
          userId: "user-123",
          achievementKey: "FIRST_PROJECT",
          earnedAt,
        },
      ] as never);

      const result = await getRecentAchievementActivity();

      expect(result).toEqual([
        {
          username: "Unknown builder",
          achievement: expect.anything(),
          earnedAt,
        },
      ]);
    });
  });
});

/*
Test coverage:

1. Creates the first project achievement
   → Verifies a new achievement is created when the user does not
     already have FIRST_PROJECT.

2. Does not create a duplicate achievement
   → Verifies the service returns null and does not call the creation
     repository when the achievement already exists.

3. Returns recent achievement activity
   → Verifies recent achievements are fetched and transformed into
     activity objects containing the username, achievement, and earnedAt.

4. Uses the default limit
   → Verifies getRecentAchievementActivity() requests 10 achievements
     when no limit is provided.

5. Handles an unpopulated user
   → Verifies the service falls back to "Unknown builder" when the
     repository returns a non-object userId.
*/
