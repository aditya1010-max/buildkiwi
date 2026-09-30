import { Router } from "express";

import { deleteComment } from "../controllers/comment.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.delete("/:id", authMiddleware, deleteComment);

export default router;
