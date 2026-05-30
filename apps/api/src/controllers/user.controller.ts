import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { findUserByIdService } from "../services/user.service";
import { AppError } from "../utils/AppError";
import { getProjectsByUserService } from "../services/project.services";

export const getUserProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const user = await findUserByIdService(id);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    res.json({
      success: true,
      user,
    });
  },
);

export const getUserProjects = asyncHandler(
  async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const projects = await getProjectsByUserService(id);

    res.json({
      success: true,
      data: projects,
    });
  },
);
