import type { Request, Response } from "express";
import type { AuthenticatedRequest } from "../types/auth";
import { asyncHandler } from "../utils/asyncHandler";
import { findUserByIdService } from "../services/user.service";
import {
  registerUserService,
  loginUserService,
} from "../services/auth.service";
import { env } from "../config/env";
import { verifyRefreshToken, generateAccessToken } from "../utils/jwt";
import { AppError } from "../utils/AppError";

const refreshCookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "none" as const,
  path: "/",
};

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
    ...refreshCookieOptions,
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    success: true,
    user,
    accessToken,
  });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const authReq = req as AuthenticatedRequest;

  if (!authReq.user) {
    throw new AppError("Unauthorized", 401);
  }

  const user = await findUserByIdService(authReq.user.userId);

  res.json({
    success: true,
    user,
  });
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: "Refresh token missing",
    });
  }

  let payload: { userId: string; email: string };

  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    res.clearCookie("refreshToken", refreshCookieOptions);

    return res.status(401).json({
      success: false,
      message: "Refresh token expired or invalid",
    });
  }

  const accessToken = generateAccessToken({
    userId: payload.userId,
    email: payload.email,
  });

  return res.status(200).json({
    success: true,
    accessToken,
  });
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  res.clearCookie("refreshToken", refreshCookieOptions);

  return res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
});
