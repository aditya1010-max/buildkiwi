import { describe, expect, it, jest, beforeEach } from "@jest/globals";

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
    it("creates and returns the first project achievement when not already earned", async () => {
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

      expect(result).toBeDefined();
      expect(result).toEqual({
        key: "FIRST_PROJECT",
        name: "First Spark",
        description: "Published your first project",
        image: "/achievements/first-spark.webp",
      });
    });

    it("does not create the achievement when it already exists", async () => {
      mockFindUserAchievement.mockResolvedValue({
        userId: "user-123",
        achievementKey: "FIRST_PROJECT",
      } as never);

      const result = await checkFirstProject("user-123");

      expect(result).toBeNull();
      expect(mockCreateUserAchievement).not.toHaveBeenCalled();
    });
  });

  describe("getRecentAchievementActivity", () => {
    it("maps recent achievements into activity data", async () => {
      const earnedAt = new Date();

      mockGetRecentAchievements.mockResolvedValue([
        {
          userId: {
            username: "aditya",
          },
          achievementKey: "FIRST_PROJECT",
          earnedAt,
        },
      ] as never);

      const result = await getRecentAchievementActivity();

      expect(mockGetRecentAchievements).toHaveBeenCalledWith(10);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        username: "aditya",
        achievement: expect.objectContaining({
          key: "FIRST_PROJECT",
        }),
        earnedAt,
      });
    });

    it("ignores achievements with unknown achievement keys", async () => {
      mockGetRecentAchievements.mockResolvedValue([
        {
          userId: {
            username: "aditya",
          },
          achievementKey: "UNKNOWN_ACHIEVEMENT",
          earnedAt: new Date(),
        },
      ] as never);

      const result = await getRecentAchievementActivity();

      expect(result).toEqual([]);
    });

    it("uses a fallback username when the user is not populated", async () => {
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
        expect.objectContaining({
          username: "Unknown builder",
          earnedAt,
        }),
      ]);
    });
  });
});

/*
Test coverage:

1. Creates and returns the first project achievement
   → Verifies the service creates the FIRST_PROJECT achievement when the
     user has not earned it yet and returns the corresponding achievement.

2. Does not create an existing achievement
   → Verifies duplicate FIRST_PROJECT achievements are not created and
     the service returns null when the achievement already exists.

3. Maps recent achievements into activity data
   → Verifies repository results are transformed into the username,
     achievement, and earnedAt structure expected by the application.

4. Ignores unknown achievement keys
   → Verifies achievements that do not exist in the ACHIEVEMENTS definition
     are removed from the returned activity list.

5. Uses a fallback username
   → Verifies the service returns "Unknown builder" when userId is not a
     populated user object.
*/
