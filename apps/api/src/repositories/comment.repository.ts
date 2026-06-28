import { Comment } from "../models/comment.model";
import { CreateCommentInput } from "@buildkiwi/validation";

export const createCommentRepository = async (
  data: CreateCommentInput & { userId: string },
) => {
  return await Comment.create(data);
};

export const getCommentsByProjectRepository = async (projectId: string) => {
  return await Comment.find({
    projectId,
  })
    .populate("userId", "username")
    .sort({ createdAt: -1 });
};
