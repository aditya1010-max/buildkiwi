import { Project } from "../models/project.models";

export const projectRepository = {
  create: async (data: any) => {
    return await Project.create(data);
  },

  findAll: async (page: number, limit: number) => {
    const skip = (page - 1) * limit;
    return await Project.find()
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
      .sort({ createdAt: -1 })
      .lean();
  },

  findById: async (id: string) => {
    return await Project.findById(id);
  },

  update: async (id: string, updateData: any) => {
    return await Project.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }, // { new: true } returns the updated doc instead of the old one
    );
  },

  delete: async (id: string) => {
    const result = await Project.findByIdAndDelete(id);
    return !!result;
  },
};

//introduced and refactored the file
