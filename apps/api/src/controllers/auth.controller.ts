import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { findUserByIdService } from "../services/user.service";
import {
  registerUserService,
  loginUserService,
} from "../services/auth.service";

export interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
  };
}

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  const user = await registerUserService({
    username,
    email,
    password,
  });

  res.status(201).json({
    success: true,
    user,
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const result = await loginUserService(email, password);

  res.json({ success: true, user: result.user, token: result.token });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;
  const user = await findUserByIdService(authReq.user.userId);

  res.json({
    success: true,
    user,
  });
});
