import type { PatternId } from "@buildkiwi/pattern-engine";

import Like from "../models/like.model";

type PopulatedCreator = {
  username: string;
  avatarSeed: string;
  avatarPattern: PatternId;
};

export const likeRepository = {
  create: async (userId: string, projectId: string) => {
    return Like.create({
      userId,
      projectId,
    });
  },

  find: async (userId: string, projectId: string) => {
    return Like.findOne({
      userId,
      projectId,
    });
  },

  delete: async (userId: string, projectId: string) => {
    return Like.findOneAndDelete({
      userId,
      projectId,
    });
  },

  findByUserId: async (userId: string) => {
    return Like.find({ userId })
      .populate<{
        projectId: {
          creatorId: PopulatedCreator;
        };
      }>({
        path: "projectId",
        select:
          "title description tags coverImage links stats creatorId createdAt updatedAt",
        populate: {
          path: "creatorId",
          select: "username avatarSeed avatarPattern",
        },
      })
      .sort({
        createdAt: -1,
      });
  },
};
