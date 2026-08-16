import { Request, Response } from "express";

import { asyncHandler } from "../utils/asyncHandler";

export const createProject = asyncHandler(
  async (req: Request, res: Response) => {
    return res.json({
      success: true,
      body: req.body,
      file: req.file,
    });
  },
);
