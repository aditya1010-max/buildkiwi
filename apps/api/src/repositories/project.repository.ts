import { Project } from "../models/project.models";

export const createProjectRepository = async (data: any) => {
  return await Project.create(data);
};

export const getProjectsRepository = async (page: number, limit: number) => {
  const skip = (page - 1) * limit;
  const projects = await Project.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  return projects;
};

export const getProjectsCountRepository = async () => {
  return await Project.countDocuments();
};
