import { Comment } from "../models/comment.model";

export const createCommentRepository = async (data: any) => {
  return await Comment.create(data);
};

export const getCommentsByProjectRepository = async (projectId: string) => {
  return await Comment.find({
    projectId,
  })
    .populate("userId", "username")
    .sort({ createdAt: -1 });
};
