import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import compression from "compression";

import { env } from "./config/env";
import { connectDB } from "./config/db";

import { errorHandler } from "./middleware/errorHandler";
import { apiLimiter, authLimiter } from "./middleware/rateLimiter";

import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import projectRoutes from "./routes/project.routes";
import feedRoutes from "./routes/feed.routes";
import searchRoutes from "./routes/search.routes";
import commentRoutes from "./routes/comment.routes";
import likeRoutes from "./routes/like.routes";
import testRoutes from "./routes/test.routes";

dotenv.config();

const app = express();
const PORT = env.PORT;

connectDB();

app.use(apiLimiter);

app.use(helmet());
app.use(hpp());
app.use(compression());

app.use(cors());
app.use(express.json());

app.use("/auth", authLimiter, authRoutes);
app.use("/users", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/feed", feedRoutes);
app.use("/search", searchRoutes);
app.use("/api", commentRoutes);
app.use("/api", likeRoutes);
app.use("/test", testRoutes);

app.get("/health", (_req, res) => {
  res.send("Working fine");
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});