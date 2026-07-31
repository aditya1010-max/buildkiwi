import { Project } from "../models/project.model";
import { CreateProjectInput, UpdateProjectInput } from "@buildkiwi/validation";

export const projectRepository = {
  create: async (data: CreateProjectInput) => {
    return await Project.create(data);
  },

  findAll: async (page: number, limit: number) => {
    const skip = (page - 1) * limit;
    return await Project.find()
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
      { new: true, runValidators: true }, // { new: true } returns the updated doc instead of the old one
    ).populate("creatorId", "username");
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
