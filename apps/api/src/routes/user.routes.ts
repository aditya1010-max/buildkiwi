import { Router } from "express";

import {
  getUserProfile,
  getUserProjects,
  updateUserProfile,
} from "../controllers/user.controller";

import { authMiddleware } from "../middleware/auth.middleware";
const router = Router();

router.get("/:id", getUserProfile);
router.get("/:id/projects", getUserProjects);
router.patch("/:id", authMiddleware, updateUserProfile);
export default router;
