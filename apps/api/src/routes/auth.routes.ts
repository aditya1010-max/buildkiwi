import { Router } from "express";
import {
  register,
  login,
  me,
  refresh,
  logout,
} from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);

router.get("/me", authMiddleware, me);

router.post("/refresh", refresh);
router.post("/logout", logout);

export default router;
