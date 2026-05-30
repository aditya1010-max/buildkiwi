import { Router } from "express";

import {
  getUserProfile,
  getUserProjects,
} from "../controllers/user.controller";

const router = Router();

router.get("/:id", getUserProfile);
router.get("/:id/projects", getUserProjects);
export default router;
