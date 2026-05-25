import { Request, Response} from "express";
import { createProjectService, getProjectsService } from "../services/project.services";
import { projectSchema } from "../../src/server/schema/serverSchema";   //this needs to be fixed
import { validateSchemaData } from "../../src/server/utils/validateSchema";  // and this too

export const createProject = async (req: Request, res: Response) => {
  try {
    const data = req.body;

    const errors = validateSchemaData(projectSchema, data);

    if (errors.length > 0) {
      return res.status(400).json({
        errors,
      });
    }
    const project = await createProjectService(
      "project",
      data
    );

    return res.status(201).json(project);

  } catch (error) {
    return res.status(500).json({ message: "Error creating project" });
  }
};

export const getProjects = async ( req: Request, res: Response ) => {
  try {
    const projects = await getProjectsService();

    return res.json(projects);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching projects" });
  }
};