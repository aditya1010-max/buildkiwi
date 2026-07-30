import { Router } from "express";

import { createFeedback } from "../controllers/feedback.controller";

const router = Router();

// Public endpoint
router.post("/", createFeedback);

export default router;
