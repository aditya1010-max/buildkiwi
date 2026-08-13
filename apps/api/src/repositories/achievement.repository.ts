import { UserAchievement } from "../models/userAchievement.model";
import type { AchievementKey } from "../constants/achievements";

export const findUserAchievement = async (
  userId: string,
  achievementKey: AchievementKey,
) => {
  return UserAchievement.findOne({
    userId,
    achievementKey,
  }).lean();
};

export const createUserAchievement = async (
  userId: string,
  achievementKey: AchievementKey,
) => {
  return UserAchievement.create({
    userId,
    achievementKey,
  });
};
