import type { CreateCommentInput } from "@buildkiwi/validation";

import { Comment } from "../models/comment.model";

export const createCommentRepository = async (
  data: CreateCommentInput & {
    projectId: string;
    userId: string;
  },
) => {
  const comment = await Comment.create(data);

  return Comment.findById(comment._id)
    .populate("userId", "username avatarSeed avatarPattern")
    .lean();
};

export const getCommentsByProjectRepository = async (
  projectId: string,
  page: number,
  limit: number,
) => {
  const skip = (page - 1) * limit;

  return Comment.find({ projectId })
    .populate("userId", "username avatarSeed avatarPattern")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
};

export const countCommentsByProjectRepository = async (projectId: string) => {
  return Comment.countDocuments({ projectId });
};

export const getCommentByIdRepository = async (commentId: string) => {
  return Comment.findById(commentId).lean();
};

export const deleteCommentRepository = async (commentId: string) => {
  return Comment.findByIdAndDelete(commentId);
};
