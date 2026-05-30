import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { CreateCommentSchema } from "@buildkiwi/validation";
import {
  createCommentService,
  getCommentsByProjectService,
} from "../services/comment.service";

export const createComment = asyncHandler(
  async (req: Request, res: Response) => {
    const projectId = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const userId = (req as any).user.userId;

    const { content } = CreateCommentSchema.parse(req.body);

    const comment = await createCommentService(projectId, userId, content);

    res.status(201).json({
      success: true,
      data: comment,
    });
  },
);

export const getComments = asyncHandler(async (req: Request, res: Response) => {
  const projectId = Array.isArray(req.params.id)
    ? req.params.id[0]
    : req.params.id;

  const comments = await getCommentsByProjectService(projectId);

  res.json({
    success: true,
    data: comments,
  });
});
