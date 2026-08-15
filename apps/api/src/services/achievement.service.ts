import { ACHIEVEMENTS, type AchievementKey } from "../constants/achievements";

import {
  findUserAchievement,
  getRecentAchievements,
} from "../repositories/achievement.repository";

import { createUserAchievement } from "../repositories/achievement.repository";

export const checkFirstProject = async (userId: string) => {
  const achievementKey: AchievementKey = "FIRST_PROJECT";

  const existingAchievement = await findUserAchievement(userId, achievementKey);

  if (existingAchievement) {
    return null;
  }

  await createUserAchievement(userId, achievementKey);

  return ACHIEVEMENTS[achievementKey];
};

export const getRecentAchievementActivity = async (limit: number = 10) => {
  const achievements = await getRecentAchievements(limit);

  return achievements
    .map((userAchievement) => {
      const achievement = ACHIEVEMENTS[userAchievement.achievementKey];
      if (!achievement) return null;
      return {
        username:
          typeof userAchievement.userId === "object" &&
          userAchievement.userId !== null
            ? userAchievement.userId.username
            : "Unknown builder",
        achievement,
        earnedAt: userAchievement.earnedAt,
      };
    })
    .filter(Boolean);
};
