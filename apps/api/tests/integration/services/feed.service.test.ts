import { beforeEach, describe, expect, it, jest } from "@jest/globals";

import { getFeedRepository } from "../../../src/repositories/feed.repository";

import { getFeedService } from "../../../src/services/feed.service";

jest.mock("../../../src/repositories/feed.repository", () => ({
  getFeedRepository: jest.fn(),
}));

const mockGetFeed = jest.mocked(getFeedRepository);

describe("feed service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getFeedService", () => {
    it("gets the feed using the provided pagination values", async () => {
      const feed = [
        {
          _id: "project-1",
          title: "BuildKiwi",
        },
        {
          _id: "project-2",
          title: "PulseChat",
        },
      ];

      mockGetFeed.mockResolvedValue(feed as never);

      const result = await getFeedService(2, 10);

      expect(mockGetFeed).toHaveBeenCalledWith(2, 10);
      expect(result).toBe(feed);
    });
  });
});

/*
Test coverage:

1. Gets the project feed
   → Verifies the service passes the requested page and limit to the
     feed repository and returns the repository result.
*/
