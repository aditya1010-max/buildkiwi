import { Request, Response } from "express";

import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";

import {
  addBookmarkService,
  removeBookmarkService,
  getBookmarksService,
} from "../services/bookmark.service";
import { AuthenticatedRequest } from "../types/auth";

export const addBookmark = asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;

  if (!authReq.user) {
    throw new AppError("Unauthorized.", 401);
  }

  const projectId = Array.isArray(req.params.projectId)
    ? req.params.projectId[0]
    : req.params.projectId;

  await addBookmarkService(authReq.user.userId, projectId);

  res.status(201).json({
    success: true,
    message: "Project bookmarked successfully.",
  });
});

export const removeBookmark = asyncHandler(
  async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;

    if (!authReq.user) {
      throw new AppError("Unauthorized.", 401);
    }

    const projectId = Array.isArray(req.params.projectId)
      ? req.params.projectId[0]
      : req.params.projectId;

    await removeBookmarkService(authReq.user.userId, projectId);

    res.status(200).json({
      success: true,
      message: "Bookmark removed successfully.",
    });
  },
);

export const getBookmarks = asyncHandler(
  async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;

    if (!authReq.user) {
      throw new AppError("Unauthorized.", 401);
    }

    const projects = await getBookmarksService(authReq.user.userId);

    res.status(200).json({
      success: true,
      projects,
    });
  },
);
