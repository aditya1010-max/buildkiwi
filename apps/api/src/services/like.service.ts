import {
  createLikeRepository,
  removeLikeRepository,
  countLikesRepository,
} from "../repositories/like.repository";

export const likeProjectService = async (projectId: string, userId: string) => {
  return await createLikeRepository(projectId, userId);
};

export const unlikeProjectService = async (
  projectId: string,
  userId: string,
) => {
  return await removeLikeRepository(projectId, userId);
};

export const getLikesCountService = async (projectId: string) => {
  return await countLikesRepository(projectId);
};
