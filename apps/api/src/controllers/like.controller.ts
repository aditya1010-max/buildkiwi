import { Request, Response } from "express";

import { asyncHandler } from "../utils/asyncHandler";

import {
  likeProjectService,
  unlikeProjectService,
  getLikesCountService,
} from "../services/like.service";

export interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
  };
}

export const likeProject = asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;
  const projectId = Array.isArray(req.params.id)
    ? authReq.params.id[0]
    : (authReq.params.id as string);

  await likeProjectService(projectId, authReq.user.userId);

  res.status(201).json({
    success: true,
  });
});

export const unlikeProject = asyncHandler(
  async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const projectId = Array.isArray(authReq.params.id)
      ? authReq.params.id[0]
      : (authReq.params.id as string);

    await unlikeProjectService(projectId, authReq.user.userId);

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
