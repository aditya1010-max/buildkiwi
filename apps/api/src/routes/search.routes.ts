import { Router } from "express";

import { searchProjects } from "../controllers/search.controller";

const router = Router();

router.get("/", searchProjects);

export default router;
