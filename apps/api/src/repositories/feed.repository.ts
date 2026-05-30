import { Project } from "../models/project.models";

export const getFeedRepository = async (page: number, limit: number) => {
  return await Project.find()
    .populate("creatorId", "username")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit);
};
