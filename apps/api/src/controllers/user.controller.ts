import { Request, Response } from "express";
import { UpdateUserSchema } from "@buildkiwi/validation";

import { AppError } from "../utils/AppError";
import { asyncHandler } from "../utils/asyncHandler";
import { getProjectsByUserService } from "../services/project.services";
import {
  findUserByIdService,
  updateUserProfileService,
} from "../services/user.service";

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

export const updateUserProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    if (!req.user) {
      throw new AppError("Unauthorized", 401);
    }

    const authenticatedUserId = req.user.userId;

    if (authenticatedUserId !== id) {
      throw new AppError("You can only update your own profile", 403);
    }

    const updateData = UpdateUserSchema.parse(req.body);

    const user = await updateUserProfileService(id, updateData);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    res.json({
      success: true,
      user,
    });
  },
);
