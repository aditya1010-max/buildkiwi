import { Router } from "express";
import {
  createProject,
  getProjects,
  updateProject,
  getProject,
  deleteProject,
} from "../controllers/project.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { upload } from "../middleware/upload.middleware";

const router = Router();

// console.log("PROJECT ROUTES FILE LOADED");
router.post("/", authMiddleware, upload.single("coverImage"), createProject);
router.get("/", getProjects);
router.get("/:id", getProject);
router.patch("/:id", authMiddleware, updateProject);
router.delete("/:id", authMiddleware, deleteProject);

export default router;
