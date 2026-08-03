import {
  getEditableProjectById,
  projectRepository,
} from "../repositories/project.repository";
import {
  getSavedProjectsRepository,
  saveProjectRepository,
  unsaveProjectRepository,
} from "../repositories/user.repository";

interface GetProjectsOptions {
  page: number;
  limit: number;
  query?: string;
  filter?: "all" | "projects" | "users" | "tags";
}

export const createProjectService = async (data: any, creatorId: string) => {
  const projectData = {
    ...data,
    creatorId,
  };
  return await projectRepository.create(projectData);
};

export const getProjectsService = async ({
  page,
  limit,
  query,
  filter,
}: GetProjectsOptions) => {
  const projects = await projectRepository.findAll({
    page,
    limit,
    query,
    filter,
  });

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

export const saveProjectService = async (userId: string, projectId: string) => {
  await saveProjectRepository(userId, projectId);
};

export const unsaveProjectService = async (
  userId: string,
  projectId: string,
) => {
  await unsaveProjectRepository(userId, projectId);
};

export const getSavedProjectsService = async (userId: string) => {
  return await getSavedProjectsRepository(userId);
};

export async function getEditableProjectService(
  projectId: string,
  authUserId: string,
) {
  return await getEditableProjectById(projectId, authUserId);
}
