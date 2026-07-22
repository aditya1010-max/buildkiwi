import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { findUserByIdService } from "../services/user.service";
import {
  registerUserService,
  loginUserService,
} from "../services/auth.service";
import { env } from "../config/env";
import { verifyRefreshToken, generateAccessToken } from "../utils/jwt";

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

  const { user, accessToken, refreshToken } = await loginUserService(
    email,
    password,
  );

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  res.status(200).json({
    success: true,
    user,
    accessToken,
  });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;
  const user = await findUserByIdService(authReq.user.userId);

  res.json({
    success: true,
    user,
  });
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: "Refresh token missing",
    });
  }

  const payload = verifyRefreshToken(refreshToken) as {
    userId: string;
    email: string;
  };

  const accessToken = generateAccessToken({
    userId: payload.userId,
    email: payload.email,
  });

  res.status(200).json({
    success: true,
    accessToken,
  });
});
