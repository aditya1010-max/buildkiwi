import Bookmark from "../models/bookmark.model";

export const bookmarkRepository = {
  create: async (userId: string, projectId: string) => {
    return await Bookmark.create({
      userId,
      projectId,
    });
  },

  find: async (userId: string, projectId: string) => {
    return await Bookmark.findOne({
      userId,
      projectId,
    });
  },

  delete: async (userId: string, projectId: string) => {
    return await Bookmark.findOneAndDelete({
      userId,
      projectId,
    });
  },

  findByUserId: async (userId: string) => {
    return await Bookmark.find({ userId })
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
