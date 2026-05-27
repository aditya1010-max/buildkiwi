import {
  createProjectRepository,
  getProjectsRepository
} from "../repositories/project.repository";

export const createProjectService =
  async (data: any) => {

    return await createProjectRepository({
      type: "project",
      data,
    });
  };

export const getProjectsService =
  async () => {

    return await getProjectsRepository();
  };