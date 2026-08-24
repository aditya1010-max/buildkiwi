import { Request, Response } from "express";

import { asyncHandler } from "../utils/asyncHandler";
import { getRecentAchievementActivity } from "../services/achievement.service";

export const getAchievementActivity = asyncHandler(
  async (req: Request, res: Response) => {
    const requestedLimit =
      req.query.limit !== undefined ? Number(req.query.limit) : 10;

    const limit = Math.min(Math.max(requestedLimit, 1), 20);

    const achievements = await getRecentAchievementActivity(limit);

    res.status(200).json({
      success: true,
      data: achievements,
    });
  },
);
