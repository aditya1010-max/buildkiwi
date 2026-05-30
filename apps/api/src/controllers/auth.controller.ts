import { Request, Response } from "express";

import { asyncHandler } from "../utils/asyncHandler";

import {
  registerUserService,
  loginUserService,
} from "../services/auth.service";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  const user = await registerUserService(username, email, password);

  res.status(201).json({
    success: true,
    user,
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await loginUserService(email, password);

  res.json({ success: true, user });
});

export const me = asyncHandler(async (_req: Request, res: Response) => {
  res.json({
    message: "Me endpoint coming soon",
  });
});
