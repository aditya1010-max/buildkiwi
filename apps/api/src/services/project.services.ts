import {
  createProjectRepository,
  getProjectsCountRepository,
  getProjectsRepository,
  getProjectsByUserRepository,
} from "../repositories/project.repository";

export const createProjectService = async (data: any, creatorId: string) => {
  return await createProjectRepository({
    type: "project",
    creatorId,
    data,
  });
};

export const getProjectsService = async (page: number, limit: number) => {
  const projects = await getProjectsRepository(page, limit);

  const total = await getProjectsCountRepository();

  return {
    projects,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total,
    },
  };
};

export const getProjectsByUserService = async (userId: string) => {
  return await getProjectsByUserRepository(userId);
};
