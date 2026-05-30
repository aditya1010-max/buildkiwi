import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { getFeedService } from "../services/feed.service";

export const getFeed = asyncHandler(async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;

  const limit = Number(req.query.limit) || 10;

  const projects = await getFeedService(page, limit);

  res.json({
    success: true,
    data: projects,
  });
});
