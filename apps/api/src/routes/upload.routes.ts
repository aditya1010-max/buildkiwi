import { Router } from "express";
import { createProject } from "../controllers/project.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { upload } from "../middleware/upload.middleware";

const router = Router();

router.post(
  "/",
  (_req, _res, next) => {
    next();
  },
  authMiddleware,
  (req, res, next) => {
    upload.single("coverImage")(req, res, (err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      next();
    });
  },
  createProject,
);
