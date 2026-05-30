import { Router } from "express";

import { createComment, getComments } from "../controllers/comment.controller";

import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/projects/:id/comments", authMiddleware, createComment);

router.get("/projects/:id/comments", getComments);

export default router;
