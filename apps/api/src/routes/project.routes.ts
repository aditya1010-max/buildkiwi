import { Router } from "express";
import {
  createProject,
  getProjects,
  updateProject,
  getProject,
  deleteProject,
  saveProject,
  unsaveProject,
  getSavedProjects,
  getEditableProject,
  getMyProjects,
} from "../controllers/project.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { upload } from "../middleware/upload.middleware";
import { recordView } from "../controllers/projectView.controller";
import { visitorMiddleware } from "../middleware/visitor.middleware";

const router = Router();

// the order of the routes matters, so make sure to put the more specific routes before the more general ones
//static rroutes should be defined before dynamic routes to avoid conflicts

// console.log("PROJECT ROUTES FILE LOADED");
router.post("/", authMiddleware, upload.single("coverImage"), createProject);
router.get("/", getProjects);

router.get("/saved", authMiddleware, getSavedProjects);
router.get("/mine", authMiddleware, getMyProjects);
router.get("/:id/edit", authMiddleware, getEditableProject);
router.post("/:id/view", visitorMiddleware, recordView);
router.get("/:id", getProject);
router.post("/:id/save", authMiddleware, saveProject);
router.delete("/:id/save", authMiddleware, unsaveProject);

router.patch("/:id", authMiddleware, updateProject);
router.delete("/:id", authMiddleware, deleteProject);

export default router;
