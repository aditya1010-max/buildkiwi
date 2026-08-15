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

export const getRecentAchievements = async (limit: number = 10) => {
  return UserAchievement.find()
    .sort({ earnedAt: -1 })
    .limit(limit)
    .populate<{ userId: { _id: string; username: string } }>(
      "userId",
      "username",
    )
    .lean();
};
