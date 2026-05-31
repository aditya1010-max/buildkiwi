import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db";
import projectRoutes from "./routes/project.routes";
import testRoutes from "./routes/test.routes";
import cors from "cors";
import { errorHandler } from "./middleware/errorHandler";
import { env } from "./config/env";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import feedRoutes from "./routes/feed.routes";
import commentRoutes from "./routes/comment.routes";
import likeRoutes from "./routes/like.routes";
import searchRoutes from "./routes/search.routes";
import helmet from "helmet";
import hpp from "hpp";
import compression from "compression";
import { apiLimiter, authLimiter } from "./middleware/rateLimiter";

dotenv.config();

const app = express();
const PORT = env.PORT;
connectDB();

app.use(apiLimiter);
app.use(helmet());
app.use(hpp());
app.use(compression());
app.use(express.json());
app.use(cors());
app.use("/api/projects", projectRoutes);
app.use("/test", testRoutes);
app.use("/auth", authLimiter, authRoutes);
app.use("/users", userRoutes);
app.use("/feed", feedRoutes);
app.use("/api", commentRoutes);
app.use("/api", likeRoutes);
app.use("/search", searchRoutes);
app.use(errorHandler);

app.get("/health", (_req, res) => {
  // _ infront of req to ignore the unused params
  res.send("Working fine");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
