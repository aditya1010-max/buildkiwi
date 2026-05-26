import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db"
import projectRoutes from "./routes/project.routes";
import testRoutes from "./routes/test.routes";
import cors from "cors";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();

const app = express();
connectDB();

app.use(express.json());
app.use(cors());
app.use("/api/projects", projectRoutes);
app.use("/test", testRoutes);
app.use(errorHandler);

app.get("/health", (_req, res) => {  // _ infront of req to ignore the unused params
  res.send("Working fine");
});



app.listen(3000, () => {
  console.log("Server running on port 3000");
});