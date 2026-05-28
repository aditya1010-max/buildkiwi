import { Request, Response} from "express";
import { createProjectService, getProjectsService } from "../services/project.services";
import { projectSchema } from "../schema/serverSchema";   //this needs to be fixed
import { validateSchemaData } from "../utils/validateSchema";  // and this too
import { CreateProjectSchema } from "@buildkiwi/validation";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../utils/AppError";


export const createProject = asyncHandler(
  async (req: Request, res: Response) => {
    const validateData =    //extra validation to ensure that the data is correct before it hits the service layer, this is in addition to the zod validation in the route handler
      CreateProjectSchema.parse(req.body);
      const errors = validateSchemaData(projectSchema, validateData);
      if (errors.length > 0) {
        throw new AppError(
          "Validation failed",
          400
        );
      }
    const project = await createProjectService(validateData);
    
    res.status(201).json({
      success: true, 
      data: project,
    });
  }
);

export const getProjects = asyncHandler(

  async (req, res) => {
    const page = Math.max(1, Number(req.query.page) || 1, 1);
    const limit = Math.min(20, Math.max(1,Number(req.query.limit)) || 10);
    const result = await getProjectsService(page, limit);

    res.json({
      success: true,
      data: result.projects,
      pagination: result.pagination,
    });
  }
);