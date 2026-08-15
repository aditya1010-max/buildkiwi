import { Router } from "express";

import { getAchievementActivity } from "../controllers/achievement.controller";

const router = Router();

router.get("/activity", getAchievementActivity);

export default router;
