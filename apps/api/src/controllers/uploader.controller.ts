import { Request, Response } from "express";

import { asyncHandler } from "../utils/asyncHandler";

export const createProject = asyncHandler(
  async (req: Request, res: Response) => {
    console.log("CONTROLLER REACHED");
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);
    console.log("CONTENT TYPE:", req.headers["content-type"]);
    return res.json({
      success: true,
      body: req.body,
      file: req.file,
    });
  },
);
