import { Request, Response } from "express";

import { asyncHandler } from "../utils/asyncHandler";

import {
  likeProjectService,
  unlikeProjectService,
  getLikesCountService,
} from "../services/like.service";

export const likeProject = asyncHandler(async (req: Request, res: Response) => {
  const projectId = Array.isArray(req.params.id)
    ? req.params.id[0]
    : (req.params.id as string);

  const userId = (req as any).user.userId;

  await likeProjectService(projectId, userId);

  res.status(201).json({
    success: true,
  });
});

export const unlikeProject = asyncHandler(
  async (req: Request, res: Response) => {
    const projectId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : (req.params.id as string);

    const userId = (req as any).user.userId;

    await unlikeProjectService(projectId, userId);

    res.json({
      success: true,
    });
  },
);

export const getLikesCount = asyncHandler(
  async (req: Request, res: Response) => {
    const projectId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : (req.params.id as string);

    const count = await getLikesCountService(projectId);

    res.json({
      success: true,
      count,
    });
  },
);
