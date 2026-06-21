import { Router } from "express";
import {
  createProject,
  getProjects,
  updateProject,
  getProject,
  deleteProject,
} from "../controllers/project.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/", authMiddleware, createProject);
router.get("/", getProjects);
router.get("/:id", getProject);
router.patch("/:id", authMiddleware, updateProject);
router.delete("/:id", authMiddleware, deleteProject);

export default router;
