import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db"
import projectRoutes from "./routes/project.routes";
import testRoutes from "./routes/test.routes";
import cors from "cors";

dotenv.config();

const app = express();
connectDB();

app.use(express.json());
app.use(cors());
app.use("/projects", projectRoutes);
app.use("/test", testRoutes);


app.get("/health", (req, res) => {
  res.send("Working fine");
});



app.listen(3000, () => {
  console.log("Server running on port 3000");
});