import { Request, Response } from "express";

import { asyncHandler } from "../utils/asyncHandler";

import { searchProjectsService } from "../services/search.service";

export const searchProjects = asyncHandler(
  async (req: Request, res: Response) => {
    const query = String(req.query.q || "");

    const page = Number(req.query.page) || 1;

    const limit = Number(req.query.limit) || 10;

    const projects = await searchProjectsService(query, page, limit);

    res.json({
      success: true,
      query,
      count: projects.length,
      data: projects,
    });
  },
);
