import type { PatternId } from "@buildkiwi/pattern-engine";

import BookmarkModel from "../models/bookmark.model";
import type { ProjectDocument } from "../models/project.model";

type PopulatedCreator = {
  username: string;
  avatarSeed: string;
  avatarPattern: PatternId;
};

type PopulatedProject = ProjectDocument & {
  creatorId: PopulatedCreator;
};

export const bookmarkRepository = {
  create: async (userId: string, projectId: string) => {
    return BookmarkModel.create({
      userId,
      projectId,
    });
  },

  find: async (userId: string, projectId: string) => {
    return BookmarkModel.findOne({
      userId,
      projectId,
    });
  },

  delete: async (userId: string, projectId: string) => {
    return BookmarkModel.findOneAndDelete({
      userId,
      projectId,
    });
  },

  findByUserId: async (userId: string) => {
    return BookmarkModel.find({ userId })
      .populate<{ projectId: PopulatedProject }>({
        path: "projectId",
        select:
          "title description tags coverSeed links stats creatorId createdAt updatedAt",
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
