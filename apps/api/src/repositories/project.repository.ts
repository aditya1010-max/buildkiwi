import { Project } from "../models/project.models";

export const createProjectRepository = async (data:any) => {
   return await Project.create(data);
};

export const getProjectsRepository = async () => {
   return await Project
      .find()
      .sort({createdAt:-1});
};