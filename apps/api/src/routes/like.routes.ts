import { Router } from "express";
import { addLike, removeLike, getLikes } from "../controllers/like.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.get("/", getLikes);

router.post("/:projectId", addLike);

router.delete("/:projectId", removeLike);

export default router;
