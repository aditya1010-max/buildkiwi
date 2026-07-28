import { Router } from "express";
import { createFeedback } from "../repositories/feedback.repository";
// import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// Public endpoint
router.post("/", createFeedback);

// If you decide feedback should require login instead:
// router.post("/", authMiddleware, createFeedback);

export default router;
