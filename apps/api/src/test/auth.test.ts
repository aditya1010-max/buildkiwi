import request from "supertest";
import mongoose from "mongoose";
import { app } from "../app";
import { Project } from "../models/project.model";

describe("Project Routes", () => {
  afterAll(async () => {
    await Project.deleteMany({});
  });

  it("should reject unauthenticated requests", async () => {
    const res = await request(app).post("/api/v1/projects").send({
      title: "BuildKiwi",
      description: "Testing",
    });

    expect(res.status).toBe(401);
  });

  describe("GET /api/projects/:id", () => {
    it("should return 404 when project does not exist", async () => {
      const projectId = new mongoose.Types.ObjectId().toString();

      const res = await request(app).get(`/api/projects/${projectId}`);

      expect(res.status).toBe(404);
    });
  });
});

//more tests after complete implementation
// creates project
// gets project by id
// gets paginated projects
// updates project
// deletes project
