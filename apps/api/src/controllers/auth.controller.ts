import { Request, Response } from "express";

import { asyncHandler }
from "../utils/asyncHandler";

import { registerUserService }
from "../services/auth.service";

export const register = asyncHandler(
  async (
    req: Request,
    res: Response
  ) => {

    const {
      username,
      email,
      password,
    } = req.body;

    const user =
      await registerUserService(
        username,
        email,
        password
      );

    res.status(201).json({
      success: true,
      user,
    });
  }
);


export const login = asyncHandler(  //temporary login endpoint, will be implemented properly in the future
  async (_req, res) => {
    res.json({
      message: "Login coming soon",
    });
  }
);

export const me = asyncHandler(
  async (_req, res) => {
    res.json({
      message: "Me endpoint coming soon",
    });
  }
);