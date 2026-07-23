import { Response } from "express";
import { AuthenticatedRequest } from "../types/auth";
import { asyncHandler } from "../utils/asyncHandler";
import {
  addLikeService,
  removeLikeService,
  getLikesService,
} from "../services/like.service";

export const addLike = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user!.userId;
    const projectId = req.params.projectId as string;

    const like = await addLikeService(userId, projectId);

    res.status(201).json({
      success: true,
      data: like,
    });
  },
);

export const removeLike = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user!.userId;
    const projectId = req.params.projectId as string;

    await removeLikeService(userId, projectId);

    res.json({
      success: true,
      message: "Like removed successfully.",
    });
  },
);

export const getLikes = asyncHandler(
  async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user!.userId;

    const likes = await getLikesService(userId);

    res.json({
      success: true,
      data: likes,
    });
  },
);
