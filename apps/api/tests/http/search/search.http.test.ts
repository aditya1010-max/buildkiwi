import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import express from "express";
import request from "supertest";

import searchRouter from "../../../src/routes/search.routes";

import { searchProjectsService } from "../../../src/services/search.service";

jest.mock("../../../src/services/search.service", () => ({
  searchProjectsService: jest.fn(),
}));

const mockSearchProjects = jest.mocked(searchProjectsService);

const app = express();

app.use(express.json());
app.use("/search", searchRouter);

describe("search HTTP", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /search", () => {
    it("searches projects successfully", async () => {
      const projects = [
        {
          _id: "project-1",
          title: "React Dashboard",
        },
        {
          _id: "project-2",
          title: "React Portfolio",
        },
      ];

      mockSearchProjects.mockResolvedValue(projects as never);

      const response = await request(app).get("/search").query({
        q: "react",
        page: 1,
        limit: 10,
      });

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        success: true,
        query: "react",
        count: 2,
        data: projects,
      });

      expect(mockSearchProjects).toHaveBeenCalledWith("react", 1, 10);
    });

    it("uses default values when pagination and query are missing", async () => {
      mockSearchProjects.mockResolvedValue([]);

      const response = await request(app).get("/search");

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        success: true,
        query: "",
        count: 0,
        data: [],
      });

      expect(mockSearchProjects).toHaveBeenCalledWith("", 1, 10);
    });

    it("uses the requested page and limit", async () => {
      mockSearchProjects.mockResolvedValue([]);

      const response = await request(app).get("/search").query({
        q: "typescript",
        page: 3,
        limit: 5,
      });

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        success: true,
        query: "typescript",
        count: 0,
        data: [],
      });

      expect(mockSearchProjects).toHaveBeenCalledWith("typescript", 3, 5);
    });

    it("returns the correct result count", async () => {
      const projects = [
        { _id: "project-1" },
        { _id: "project-2" },
        { _id: "project-3" },
      ];

      mockSearchProjects.mockResolvedValue(projects as never);

      const response = await request(app).get("/search").query({ q: "node" });

      expect(response.status).toBe(200);

      expect(response.body.count).toBe(3);

      expect(mockSearchProjects).toHaveBeenCalledWith("node", 1, 10);
    });
  });
});

/*
Test coverage:

1. Searches projects
   → Verifies the query, pagination, response data, and result count.

2. Uses default values
   → Verifies missing q, page, and limit become "", 1, and 10.

3. Uses requested pagination
   → Verifies supplied page and limit values reach the service.

4. Returns the correct result count
   → Verifies the controller calculates count from the returned
     project array.
*/
