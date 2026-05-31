import { Like } from "../models/like.model";

export const createLikeRepository = async (
  projectId: string,
  userId: string,
) => {
  return await Like.create({
    projectId,
    userId,
  });
};

export const removeLikeRepository = async (
  projectId: string,
  userId: string,
) => {
  return await Like.findOneAndDelete({
    projectId,
    userId,
  });
};

export const countLikesRepository = async (projectId: string) => {
  return await Like.countDocuments({
    projectId,
  });
};
