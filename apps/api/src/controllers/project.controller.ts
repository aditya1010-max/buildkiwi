import { Request, Response} from "express";
import { createProjectService, getProjectsService } from "../services/project.services";
import { projectSchema } from "../schema/serverSchema";   //this needs to be fixed
import { validateSchemaData } from "../utils/validateSchema";  // and this too
import { CreateProjectSchema } from "@buildkiwi/validation";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";


export const createProject = asyncHandler(
  async (req: Request, res: Response) => {
    const validateData =
      CreateProjectSchema.parse(req.body);
      const errors = validateSchemaData(projectSchema, validateData);
      if (errors.length > 0) {
        throw new AppError(
          "Validation failed",
          400
        );
      }
    const project = await createProjectService("project", validateData);
    
    res.status(201).json({
      success: true,
      data: project,
    });
  }
);

export const getProjects = asyncHandler(
  async (_req: Request, res: Response) => {
    const projects = await getProjectsService();
    res.json(projects);
  }
);