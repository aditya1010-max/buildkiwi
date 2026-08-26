import { NextFunction, Request, Response } from "express";

export function visitorMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const visitorId = req.header("X-Visitor-Id");

  if (!visitorId) {
    return res.status(400).json({
      success: false,
      message: "Visitor ID is required.",
    });
  }

  req.visitorId = visitorId;
  next();
}
