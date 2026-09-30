import type { CreateCommentInput } from "@buildkiwi/validation";

import {
  countCommentsByProjectRepository,
  createCommentRepository,
  deleteCommentRepository,
  getCommentByIdRepository,
  getCommentsByProjectRepository,
} from "../repositories/comment.repository";

import { projectRepository } from "../repositories/project.repository";
import { AppError } from "../utils/AppError";

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 20;

export const createCommentService = async (
  projectId: string,
  userId: string,
  data: CreateCommentInput,
) => {
  const project = await projectRepository.findByIdForUpdate(projectId);

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  const comment = await createCommentRepository({
    ...data,
    projectId,
    userId,
  });

  await projectRepository.incrementCommentCount(projectId);

  return comment;
};

export const getCommentsService = async (
  projectId: string,
  page: number,
  limit: number,
) => {
  const project = await projectRepository.findById(projectId);

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  const safePage = Math.max(1, page);
  const safeLimit = Math.min(MAX_LIMIT, Math.max(1, limit || DEFAULT_LIMIT));

  const [comments, total] = await Promise.all([
    getCommentsByProjectRepository(projectId, safePage, safeLimit),
    countCommentsByProjectRepository(projectId),
  ]);

  return {
    comments,
    pagination: {
      total,
      page: safePage,
      limit: safeLimit,
      totalPages: Math.ceil(total / safeLimit),
      hasMore: safePage * safeLimit < total,
    },
  };
};

export const deleteCommentService = async (
  commentId: string,
  userId: string,
) => {
  const comment = await getCommentByIdRepository(commentId);

  if (!comment) {
    throw new AppError("Comment not found", 404);
  }

  const project = await projectRepository.findByIdForUpdate(
    String(comment.projectId),
  );

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  const isAuthor = String(comment.userId) === userId;

  const isProjectOwner = String(project.creatorId) === userId;

  if (!isAuthor && !isProjectOwner) {
    throw new AppError("You are not allowed to delete this comment", 403);
  }

  const deletedComment = await deleteCommentRepository(commentId);

  if (!deletedComment) {
    throw new AppError("Comment not found", 404);
  }

  await projectRepository.decrementCommentCount(String(comment.projectId));
};
