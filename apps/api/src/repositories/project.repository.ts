import { Project } from "../models/project.model";
import { CreateProjectInput, UpdateProjectInput } from "@buildkiwi/validation";

interface FindProjectsOptions {
  page: number;
  limit: number;
  query?: string;
  filter?: "all" | "projects" | "users" | "tags";
}

export const projectRepository = {
  create: async (data: CreateProjectInput) => {
    return await Project.create(data);
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
    return await Project.find(mongoQuery)
      .populate("creatorId", "username")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();
  },

  count: async () => {
    return await Project.countDocuments();
  },

  findByUserId: async (userId: string) => {
    return await Project.find({ creatorId: userId })
      .populate("creatorId", "username")
      .sort({ createdAt: -1 })
      .lean();
  },

  findById: async (id: string) => {
    return await Project.findById(id).populate("creatorId", "username").lean();
  },

  findByIdForUpdate: async (id: string) => {
    return await Project.findById(id);
  },

  update: async (id: string, updateData: UpdateProjectInput) => {
    return await Project.findByIdAndUpdate(
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
  return await Project.findOne({
    _id: projectId,
    creatorId: authUserId,
  });
}
