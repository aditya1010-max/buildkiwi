// eventually

// GET /achievements
// GET /users/:username/achievements
// GET /achievements/recent

import api from "./api";

import type { AchievementActivity } from "../types/achievement";

export async function getAchievementActivity(
  limit: number = 10,
): Promise<AchievementActivity[]> {
  const { data } = await api.get("/achievements/activity", {
    params: {
      limit,
    },
  });

  return data.data;
}
