import { Router } from "express";
import { createProject } from "../controllers/project.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { upload } from "../middleware/upload.middleware";

const router = Router();

router.post(
  "/",
  (_req, _res, next) => {
    console.log("ROUTE HIT");
    next();
  },
  authMiddleware,
  (req, res, next) => {
    console.log("BEFORE MULTER");

    upload.single("coverImage")(req, res, (err) => {
      console.log("AFTER MULTER");

      if (err) {
        console.error("MULTER ERROR:", err);

        return res.status(500).json({
          success: false,
          message: err.message,
        });
      }

      // console.log("BODY:", req.body);
      // console.log("FILE:", req.file);

      next();
    });
  },
  createProject,
);
