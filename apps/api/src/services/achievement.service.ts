import { ACHIEVEMENTS, type AchievementKey } from "../constants/achievements";
import { findUserAchievement } from "../repositories/achievement.repository";

export const checkFirstProject = async (userId: string) => {
  const achievementKey: AchievementKey = "FIRST_PROJECT";

  const existingAchievement = await findUserAchievement(userId, achievementKey);

  if (existingAchievement) {
    return null;
  }

  const achievement = ACHIEVEMENTS[achievementKey];

  return achievement;
};
