import { Request, Response } from "express";
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
} from "../services/project.services";
import { projectSchema } from "../schema/projectSchema";
import { validateSchemaData } from "../utils/validateSchema";
import { CreateProjectSchema } from "@buildkiwi/validation";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";

// Define a strict, local type for requests that pass through your auth middleware
interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
  };
  file?: Express.Multer.File;
}

/**
 * Validates dynamic schema data structure
 */
const runSecondaryValidation = (schema: any, data: any) => {
  const errors = validateSchemaData(schema, data);
  if (errors && errors.length > 0) {
    throw new AppError("Validation failed against structural schema", 400);
  }
};

// --- CREATE PROJECT ---
export const createProject = asyncHandler(
  async (req: Request, res: Response) => {
    const authReq = req as AuthenticatedRequest;
    const payload = {
      ...authReq.body,

      links: {
        github: authReq.body["links.github"] || "",
        demo: authReq.body["links.demo"] || "",
      },

      coverImage: authReq.file?.filename,
    };
    const validatedData = CreateProjectSchema.parse(payload);

    // const validatedData = CreateProjectSchema.parse({
    //   ...req.body,
    //   coverImage: file?.originalname,
    // });

    if (!authReq.user) {
      throw new AppError("Unauthorized", 401);
    }
    runSecondaryValidation(projectSchema, validatedData);

    const project = await createProjectService(
      validatedData,
      authReq.user.userId,
    );

    res.status(201).json({
      success: true,
      data: project,
    });
  },
);

// --- GET ALL PROJECTS ---
export const getProjects = asyncHandler(async (req: Request, res: Response) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(20, Math.max(1, Number(req.query.limit) || 10));

  const result = await getProjectsService(page, limit);

  res.json({
    success: true,
    data: result.projects,
    pagination: result.pagination,
  });
});

// --- GET SINGLE PROJECT ---
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

// --- UPDATE PROJECT ---
export const updateProject = asyncHandler(
  async (req: Request, res: Response) => {
    const id = String(req.params.id);
    const validatedData = CreateProjectSchema.partial().parse(req.body);

    runSecondaryValidation(projectSchema, validatedData);

    const authUserId = (req as AuthenticatedRequest).user.userId;
    const updatedProject = await updateProjectService(
      id,
      validatedData,
      authUserId,
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

// --- DELETE PROJECT ---
export const deleteProject = asyncHandler(
  async (req: Request, res: Response) => {
    const id = String(req.params.id);
    const authUserId = (req as AuthenticatedRequest).user.userId;

    const isDeleted = await deleteProjectService(id, authUserId);
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
  const projectId = String(req.params.id);
  const userId = (req as AuthenticatedRequest).user.userId;

  await saveProjectService(userId, projectId);

  res.status(200).json({
    success: true,
    message: "Project saved successfully",
  });
});

export const unsaveProject = asyncHandler(
  async (req: Request, res: Response) => {
    const projectId = String(req.params.id);
    const userId = (req as AuthenticatedRequest).user.userId;

    await unsaveProjectService(userId, projectId);

    res.status(200).json({
      success: true,
      message: "Project removed from saved successfully",
    });
  },
);

export const getSavedProjects = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = (req as AuthenticatedRequest).user.userId;

    const projects = await getSavedProjectsService(userId);

    res.status(200).json({
      success: true,
      data: projects,
    });
  },
);

export const getEditableProject = asyncHandler(
  async (req: Request, res: Response) => {
    const id = String(req.params.id);
    const authUserId = (req as AuthenticatedRequest).user.userId;

    const project = await getEditableProjectService(id, authUserId);

    if (!project) {
      throw new AppError("Project not found or unauthorized", 404);
    }

    res.json({
      success: true,
      data: project,
    });
  },
);
