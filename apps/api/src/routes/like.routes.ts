import { Router } from "express";

import {
  likeProject,
  unlikeProject,
  getLikesCount,
} from "../controllers/like.controller";

import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/projects/:id/like", authMiddleware, likeProject);

router.delete("/projects/:id/like", authMiddleware, unlikeProject);

router.get("/projects/:id/likes", getLikesCount);

export default router;
