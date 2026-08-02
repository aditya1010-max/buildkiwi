import { Request, Response } from "express";

import { recordProjectView } from "../services/projectView.service";

export async function recordView(req: Request, res: Response) {
  const { id } = req.params;
  const projectId = Array.isArray(id) ? id[0] : id;
  const visitorId = req.visitorId;

  if (!projectId) {
    return res.status(400).json({
      success: false,
      message: "Project ID is required.",
    });
  }

  if (!visitorId) {
    return res.status(400).json({
      success: false,
      message: "Visitor ID is required.",
    });
  }

  await recordProjectView(projectId, visitorId);

  return res.status(200).json({
    success: true,
  });
}
