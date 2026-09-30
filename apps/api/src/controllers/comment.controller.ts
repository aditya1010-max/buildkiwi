import { Request, Response } from "express";

import { CreateCommentSchema } from "@buildkiwi/validation";

import {
  createCommentService,
  deleteCommentService,
  getCommentsService,
} from "../services/comment.service";

import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";

interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
  };
}

export const createComment = asyncHandler(
  async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;

    if (!authReq.user) {
      throw new AppError("Unauthorized", 401);
    }

    const projectId = String(req.params.id);

    const validatedData = CreateCommentSchema.parse(req.body);

    const comment = await createCommentService(
      projectId,
      authReq.user.userId,
      validatedData,
    );

    res.status(201).json({
      success: true,
      data: comment,
    });
  },
);

export const getComments = asyncHandler(async (req: Request, res: Response) => {
  const projectId = String(req.params.id);

  const page = Math.max(1, Number(req.query.page) || 1);

  const limit = Math.min(20, Math.max(1, Number(req.query.limit) || 10));

  const result = await getCommentsService(projectId, page, limit);

  res.json({
    success: true,
    data: result.comments,
    pagination: result.pagination,
  });
});

export const deleteComment = asyncHandler(
  async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;

    if (!authReq.user) {
      throw new AppError("Unauthorized", 401);
    }

    const commentId = String(req.params.id);

    await deleteCommentService(commentId, authReq.user.userId);

    res.json({
      success: true,
      message: "Comment deleted successfully",
    });
  },
);
