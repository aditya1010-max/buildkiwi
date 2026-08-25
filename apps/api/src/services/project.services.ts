import { UpdateProjectInput } from "@buildkiwi/validation";
import {
  getEditableProjectById,
  projectRepository,
} from "../repositories/project.repository";
import {
  getSavedProjectsRepository,
  saveProjectRepository,
  unsaveProjectRepository,
} from "../repositories/user.repository";
import { AppError } from "../utils/AppError";
import { checkFirstProject } from "./achievement.service";

interface GetProjectsOptions {
  page: number;
  limit: number;
  query?: string;
  filter?: "all" | "projects" | "users" | "tags";
}

import type { CreateProjectInput } from "@buildkiwi/validation";

export const createProjectService = async (
  data: CreateProjectInput,
  creatorId: string,
) => {
  const projectData = {
    ...data,
    creatorId,
  };

  const project = await projectRepository.create(projectData);

  const achievement = await checkFirstProject(creatorId);

  return {
    project,
    achievement,
  };
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
  data: UpdateProjectInput,
  userId: string,
) => {
  const project = await projectRepository.findByIdForUpdate(id);

  if (!project) {
    return false;
  }

  if (
    !project.creatorId ||
    project.creatorId.toString() !== userId.toString()
  ) {
    throw new AppError("Unauthorized: You do not own this project", 403);
  }

  return await projectRepository.update(id, data);
};

export const deleteProjectService = async (id: string, userId: string) => {
  if (!id) return false;

  const project = await projectRepository.findByIdForUpdate(id);
  if (!project) {
    throw new AppError("Project not found", 404);
  }

  if (
    !project.creatorId ||
    project.creatorId.toString() !== userId.toString()
  ) {
    throw new AppError("You do not own this project", 403);
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
