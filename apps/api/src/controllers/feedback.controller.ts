import { Request, Response } from "express";

import { submitFeedback } from "../services/feedback.service";
import { asyncHandler } from "../utils/asyncHandler";

export const createFeedback = asyncHandler(
  async (req: Request, res: Response) => {
    const feedback = await submitFeedback({
      category: req.body.category,
      title: req.body.title,
      description: req.body.description,
      page: req.body.page,
      language: req.body.language,
      userAgent: req.body.userAgent,
      // userId: req.user?.userId ?? null,  //this will be fixed later
       userId: null,
    });

    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully.",
      data: feedback,
    });
  },
);
