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

  it("returns the feed for the requested page and limit", async () => {
    const feed = [
      { _id: "project-1", title: "Project One" },
      { _id: "project-2", title: "Project Two" },
    ];

    mockGetFeed.mockResolvedValue(feed as never);

    const result = await getFeedService(2, 10);

    expect(mockGetFeed).toHaveBeenCalledWith(2, 10);
    expect(result).toBe(feed);
  });
});

/*
Test coverage:

1. Returns the feed for the requested page and limit
   → Verifies the service passes the pagination values to the repository
     correctly and returns the repository result unchanged.
*/
