import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import express from "express";
import request from "supertest";

import achievementRouter from "../../../src/routes/achievemnet.routes";

import { getRecentAchievementActivity } from "../../../src/services/achievement.service";

jest.mock("../../../src/services/achievement.service", () => ({
  getRecentAchievementActivity: jest.fn(),
}));

const mockGetRecentAchievementActivity = jest.mocked(
  getRecentAchievementActivity,
);

const app = express();

app.use(express.json());
app.use("/achievements", achievementRouter);

describe("achievement HTTP", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /achievements/activity", () => {
    it("returns recent achievement activity", async () => {
      const achievements = [
        {
          username: "aditya",
          achievement: {
            key: "FIRST_PROJECT",
          },
          earnedAt: new Date(),
        },
      ];

      mockGetRecentAchievementActivity.mockResolvedValue(achievements as never);

      const response = await request(app).get("/achievements/activity");

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        success: true,
        data: expect.any(Array),
      });

      expect(mockGetRecentAchievementActivity).toHaveBeenCalledWith(10);
    });

    it("uses the requested limit", async () => {
      mockGetRecentAchievementActivity.mockResolvedValue([]);

      const response = await request(app)
        .get("/achievements/activity")
        .query({ limit: 5 });

      expect(response.status).toBe(200);

      expect(mockGetRecentAchievementActivity).toHaveBeenCalledWith(5);
    });

    it("clamps the limit to the maximum of 20", async () => {
      mockGetRecentAchievementActivity.mockResolvedValue([]);

      const response = await request(app)
        .get("/achievements/activity")
        .query({ limit: 50 });

      expect(response.status).toBe(200);

      expect(mockGetRecentAchievementActivity).toHaveBeenCalledWith(20);
    });

    it("clamps the limit to the minimum of 1", async () => {
      mockGetRecentAchievementActivity.mockResolvedValue([]);

      const response = await request(app)
        .get("/achievements/activity")
        .query({ limit: 0 });

      expect(response.status).toBe(200);

      expect(mockGetRecentAchievementActivity).toHaveBeenCalledWith(1);
    });
  });
});

/*
Test coverage:

1. Gets recent achievement activity
   → Verifies the endpoint returns achievement activity and uses
     the default limit of 10.

2. Uses the requested limit
   → Verifies a valid limit is passed to the service.

3. Clamps excessive limits
   → Verifies limits above 20 are reduced to 20.

4. Clamps very small limits
   → Verifies limits below 1 are increased to 1.
*/
