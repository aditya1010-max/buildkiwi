import { Request, Response } from "express";
import {
  createProjectService,
  getProjectsService,
  getProjectByIdService,
  updateProjectService,
  deleteProjectService,
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
    const file = (req as any).file;
    const payload = {
      ...req.body,

      links: {
        github: req.body["links.github"] || "",
        demo: req.body["links.demo"] || "",
      },

      coverImage: file?.filename,
    };
    const validatedData = CreateProjectSchema.parse(payload);

    // const validatedData = CreateProjectSchema.parse({
    //   ...req.body,
    //   coverImage: file?.originalname,
    // });

    runSecondaryValidation(projectSchema, validatedData);
    const authUserId = (req as AuthenticatedRequest).user.userId;

    const project = await createProjectService(
      {
        ...validatedData,
        // coverImage: uploadedImageUrl (aws s3 bucketto store url)
      },
      authUserId,
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
