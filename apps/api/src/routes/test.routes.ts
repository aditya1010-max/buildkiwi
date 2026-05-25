import { Router } from "express";
import { sum, square, cube } from "../controllers/test.controller"

const router = Router();

router.post("/sum", sum);
router.post("/square", square);
router.post("/cube", cube);

export default router;