import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import express from "express";
import request from "supertest";

import feedRouter from "../../../src/routes/feed.routes";

import { getFeedService } from "../../../src/services/feed.service";

jest.mock("../../../src/services/feed.service", () => ({
  getFeedService: jest.fn(),
}));

const mockGetFeed = jest.mocked(getFeedService);

const app = express();

app.use(express.json());
app.use("/feed", feedRouter);

describe("feed HTTP", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /feed", () => {
    it("returns the project feed", async () => {
      const projects = [
        {
          _id: "project-1",
          title: "BuildKiwi",
        },
        {
          _id: "project-2",
          title: "PulseChat",
        },
      ];

      mockGetFeed.mockResolvedValue(projects as never);

      const response = await request(app).get("/feed");

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        success: true,
        data: projects,
      });

      expect(mockGetFeed).toHaveBeenCalledWith(1, 10);
    });

    it("uses the requested page and limit", async () => {
      mockGetFeed.mockResolvedValue([]);

      const response = await request(app).get("/feed").query({
        page: 2,
        limit: 5,
      });

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        success: true,
        data: [],
      });

      expect(mockGetFeed).toHaveBeenCalledWith(2, 5);
    });

    it("uses default values for invalid pagination parameters", async () => {
      mockGetFeed.mockResolvedValue([]);

      const response = await request(app).get("/feed").query({
        page: "invalid",
        limit: "invalid",
      });

      expect(response.status).toBe(200);

      expect(mockGetFeed).toHaveBeenCalledWith(1, 10);
    });

    it("returns an empty feed when there are no projects", async () => {
      mockGetFeed.mockResolvedValue([]);

      const response = await request(app).get("/feed");

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        success: true,
        data: [],
      });
    });
  });
});

/*
Test coverage:

1. Gets the project feed
   → Verifies the endpoint returns projects and uses the default
     page and limit.

2. Uses requested pagination
   → Verifies page and limit query parameters are passed to the
     feed service.

3. Handles invalid pagination values
   → Verifies invalid page/limit values fall back to 1 and 10.

4. Handles an empty feed
   → Verifies an empty project list is returned successfully.
*/
