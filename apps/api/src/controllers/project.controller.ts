import type { Request, Response } from "express";
import {
  CreateProjectSchema,
  UpdateProjectSchema,
} from "@buildkiwi/validation";

import {
  createProjectService,
  getProjectsService,
  getProjectByIdService,
  updateProjectService,
  deleteProjectService,
  saveProjectService,
  unsaveProjectService,
  getSavedProjectsService,
  getEditableProjectService,
  getProjectsByUserService,
} from "../services/project.services";
import { projectSchema } from "../schema/projectSchema";
import { validateSchemaData, type Schema } from "../utils/validateSchema";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";
import { normalizeProjectPayload } from "../utils/normalizeProjectPayload";
import type { AuthenticatedRequest } from "../types/auth";

const requireAuthenticatedUser = (req: Request): string => {
  const userId = (req as AuthenticatedRequest).user?.userId;

  if (!userId) {
    throw new AppError("Unauthorized", 401);
  }

  return userId;
};

const runSecondaryValidation = (
  schema: Schema,
  data: Record<string, unknown>,
): void => {
  const errors = validateSchemaData(schema, data);

  if (errors.length > 0) {
    throw new AppError("Validation failed against structural schema", 400);
  }
};

export const createProject = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = requireAuthenticatedUser(req);

    const payload = normalizeProjectPayload(req.body);
    const validatedData = CreateProjectSchema.parse(payload);

    runSecondaryValidation(projectSchema, validatedData);

    const result = await createProjectService(validatedData, userId);

    res.status(201).json({
      success: true,
      data: result.project,
      achievement: result.achievement,
    });
  },
);

export const getProjects = asyncHandler(async (req: Request, res: Response) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(20, Math.max(1, Number(req.query.limit) || 10));

  const query =
    typeof req.query.q === "string" ? req.query.q.trim() : undefined;

  const allowedFilters = ["all", "projects", "users", "tags"] as const;
  type SearchFilter = (typeof allowedFilters)[number];

  const filter: SearchFilter | undefined =
    typeof req.query.filter === "string" &&
    allowedFilters.includes(req.query.filter as SearchFilter)
      ? (req.query.filter as SearchFilter)
      : undefined;

  const result = await getProjectsService({
    page,
    limit,
    query,
    filter,
  });

  res.json({
    success: true,
    data: result.projects,
    pagination: result.pagination,
  });
});

export const getProject = asyncHandler(async (req: Request, res: Response) => {
  const project = await getProjectByIdService(String(req.params.id));

  if (!project) {
    throw new AppError("Project not found", 404);
  }

  res.json({
    success: true,
    data: project,
  });
});

export const updateProject = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = requireAuthenticatedUser(req);
    const id = String(req.params.id);

    const payload = {
      ...normalizeProjectPayload(req.body),
      ...(req.file?.filename && {
        coverImage: req.file.filename,
      }),
    };

    const validatedData = UpdateProjectSchema.parse(payload);

    runSecondaryValidation(projectSchema, validatedData);

    const updatedProject = await updateProjectService(
      id,
      validatedData,
      userId,
    );

    if (!updatedProject) {
      throw new AppError("Project not found or unauthorized", 404);
    }

    res.json({
      success: true,
      data: updatedProject,
    });
  },
);

export const deleteProject = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = requireAuthenticatedUser(req);
    const id = String(req.params.id);

    const isDeleted = await deleteProjectService(id, userId);

    if (!isDeleted) {
      throw new AppError("Project not found or unauthorized", 404);
    }

    res.json({
      success: true,
      message: "Project deleted successfully",
    });
  },
);

export const saveProject = asyncHandler(async (req: Request, res: Response) => {
  const userId = requireAuthenticatedUser(req);
  const projectId = String(req.params.id);

  await saveProjectService(userId, projectId);

  res.status(200).json({
    success: true,
    message: "Project saved successfully",
  });
});

export const unsaveProject = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = requireAuthenticatedUser(req);
    const projectId = String(req.params.id);

    await unsaveProjectService(userId, projectId);

    res.status(200).json({
      success: true,
      message: "Project removed from saved successfully",
    });
  },
);

export const getSavedProjects = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = requireAuthenticatedUser(req);
    const projects = await getSavedProjectsService(userId);

    res.status(200).json({
      success: true,
      data: projects,
    });
  },
);

export const getEditableProject = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = requireAuthenticatedUser(req);
    const id = String(req.params.id);

    const project = await getEditableProjectService(id, userId);

    if (!project) {
      throw new AppError("Project not found or unauthorized", 404);
    }

    res.json({
      success: true,
      data: project,
    });
  },
);

export const getMyProjects = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = requireAuthenticatedUser(req);
    const projects = await getProjectsByUserService(userId);

    res.json({
      success: true,
      data: projects,
    });
  },
);
