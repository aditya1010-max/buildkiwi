import { Router } from "express";

import {
  getUserProfile,
  getUserProjects,
  updateUserProfile,
} from "../controllers/user.controller";

import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.get("/:username", getUserProfile);

router.get("/:username/projects", getUserProjects);

router.patch("/:id", authMiddleware, updateUserProfile);

export default router;
