import Like from "../models/like.model";

export const likeRepository = {
  create: async (userId: string, projectId: string) => {
    return await Like.create({
      userId,
      projectId,
    });
  },

  find: async (userId: string, projectId: string) => {
    return await Like.findOne({
      userId,
      projectId,
    });
  },

  delete: async (userId: string, projectId: string) => {
    return await Like.findOneAndDelete({
      userId,
      projectId,
    });
  },

  findByUserId: async (userId: string) => {
    return await Like.find({ userId })
      .populate({
        path: "projectId",
        select:
          "title description tags coverImage links stats creatorId createdAt updatedAt",
        populate: {
          path: "creatorId",
          select: "username",
        },
      })
      .sort({
        createdAt: -1,
      });
  },
};
