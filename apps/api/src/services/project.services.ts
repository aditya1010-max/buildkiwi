import { projectRepository } from "../repositories/project.repository";

export const createProjectService = async (data: any, creatorId: string) => {
  const projectData = {
    ...data,
    creatorId,
  };
  return await projectRepository.create(projectData);
};

export const getProjectsService = async (page: number, limit: number) => {
  const projects = await projectRepository.findAll(page, limit);

  const total = await projectRepository.count();

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
  return await projectRepository.findByUserId(userId);
};

export const getProjectByIdService = async (id: string) => {
  if (!id) return null;
  return await projectRepository.findById(id);
};

export const updateProjectService = async (
  id: string,
  updateData: any,
  userId: string,
) => {
  if (!id) return null;

  const project = await projectRepository.findById(id);
  if (!project) return null;

  if (project.creatorId?.toString() !== userId) {
    throw new Error("Unauthorized: You do not own this project");
  }

  return await projectRepository.update(id, updateData);
};

export const deleteProjectService = async (id: string, userId: string) => {
  if (!id) return false;

  const project = await projectRepository.findById(id);
  if (!project) return false;

  if (!project.creatorId || !project.creatorId.equals(userId)) {
    throw new Error("Unauthorized: You do not own this project");
  }

  return await projectRepository.delete(id);
};
