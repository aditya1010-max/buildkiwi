import {
  createCommentRepository,
  getCommentsByProjectRepository,
} from "../repositories/comment.repository";

export const createCommentService = async (
  projectId: string,
  userId: string,
  content: string,
) => {
  return await createCommentRepository({
    projectId,
    userId,
    content,
  });
};

export const getCommentsByProjectService = async (projectId: string) => {
  return await getCommentsByProjectRepository(projectId);
};
