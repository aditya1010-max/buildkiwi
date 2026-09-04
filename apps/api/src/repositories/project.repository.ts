import { CreateProjectInput, UpdateProjectInput } from "@buildkiwi/validation";

import { Project } from "../models/project.model";

interface FindProjectsOptions {
  page: number;
  limit: number;
  query?: string;
  filter?: "all" | "projects" | "users" | "tags";
}

export const projectRepository = {
  create: async (data: CreateProjectInput) => {
    return Project.create(data);
  },

  findAll: async ({ page, limit, query, filter }: FindProjectsOptions) => {
    const skip = (page - 1) * limit;
    const mongoQuery: Record<string, unknown> = {};

    if (query?.trim()) {
      const search = query.trim();
      const regex = new RegExp(search, "i");

      switch (filter) {
        case "projects":
          mongoQuery.$or = [{ title: regex }, { description: regex }];
          break;

        case "tags":
          mongoQuery.tags = regex;
          break;

        default:
          mongoQuery.$or = [
            { title: regex },
            { description: regex },
            { tags: regex },
          ];
      }
    }

    return Project.find(mongoQuery)
      .populate("creatorId", "username avatarSeed avatarPattern")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
  },

  count: async () => {
    return Project.countDocuments();
  },

  findByUserId: async (userId: string) => {
    return Project.find({ creatorId: userId })
      .populate("creatorId", "username avatarSeed avatarPattern")
      .sort({ createdAt: -1 })
      .lean();
  },

  findById: async (id: string) => {
    return Project.findById(id)
      .populate("creatorId", "username avatarSeed avatarPattern")
      .lean();
  },

  findByIdForUpdate: async (id: string) => {
    return Project.findById(id);
  },

  update: async (id: string, updateData: UpdateProjectInput) => {
    return Project.findByIdAndUpdate(
      id,
      { $set: updateData },
      {
        returnDocument: "after",
        runValidators: true,
      },
    );
  },

  delete: async (id: string) => {
    const result = await Project.findByIdAndDelete(id);
    return !!result;
  },
};

export async function getEditableProjectById(
  projectId: string,
  authUserId: string,
) {
  return Project.findOne({
    _id: projectId,
    creatorId: authUserId,
  });
}
