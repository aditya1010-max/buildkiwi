import { Router } from "express";

import { authMiddleware } from "../middleware/auth.middleware";

import {
  addBookmark,
  removeBookmark,
  getBookmarks,
} from "../controllers/bookmark.controller";

const router = Router();

router.get("/", authMiddleware, getBookmarks);

router.post("/:projectId", authMiddleware, addBookmark);

router.delete("/:projectId", authMiddleware, removeBookmark);

export default router;
