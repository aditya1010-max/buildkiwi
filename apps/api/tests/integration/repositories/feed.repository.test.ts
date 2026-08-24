import { beforeEach, describe, expect, it, jest } from "@jest/globals";

import { Project } from "../../../src/models/project.model";

import { getFeedRepository } from "../../../src/repositories/feed.repository";

jest.mock("../../../src/models/project.model", () => ({
  Project: {
    find: jest.fn(),
  },
}));

const mockFind = jest.mocked(Project.find);

describe("feed repository", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("gets paginated projects ordered by newest first", async () => {
    const projects = [
      {
        _id: "project-1",
        title: "Latest project",
      },
    ];

    const limit = jest.fn<(value: number) => Promise<typeof projects>>();
    limit.mockResolvedValue(projects);

    const skip = jest
      .fn<
        (value: number) => {
          limit: typeof limit;
        }
      >()
      .mockReturnValue({
        limit,
      });

    const sort = jest
      .fn<
        (value: { createdAt: -1 }) => {
          skip: typeof skip;
        }
      >()
      .mockReturnValue({
        skip,
      });

    const populate = jest
      .fn<
        (
          path: string,
          select: string,
        ) => {
          sort: typeof sort;
        }
      >()
      .mockReturnValue({
        sort,
      });

    mockFind.mockReturnValue({
      populate,
    } as unknown as ReturnType<typeof Project.find>);

    const result = await getFeedRepository(2, 10);

    expect(mockFind).toHaveBeenCalledWith();

    expect(populate).toHaveBeenCalledWith("creatorId", "username");

    expect(sort).toHaveBeenCalledWith({
      createdAt: -1,
    });

    expect(skip).toHaveBeenCalledWith(10);

    expect(limit).toHaveBeenCalledWith(10);

    expect(result).toBe(projects);
  });

  it("starts from the first page correctly", async () => {
    const projects: unknown[] = [];

    const limit = jest.fn<(value: number) => Promise<typeof projects>>();
    limit.mockResolvedValue(projects);

    const skip = jest
      .fn<
        (value: number) => {
          limit: typeof limit;
        }
      >()
      .mockReturnValue({
        limit,
      });

    const sort = jest
      .fn<
        (value: { createdAt: -1 }) => {
          skip: typeof skip;
        }
      >()
      .mockReturnValue({
        skip,
      });

    const populate = jest
      .fn<
        (
          path: string,
          select: string,
        ) => {
          sort: typeof sort;
        }
      >()
      .mockReturnValue({
        sort,
      });

    mockFind.mockReturnValue({
      populate,
    } as unknown as ReturnType<typeof Project.find>);

    await getFeedRepository(1, 10);

    expect(skip).toHaveBeenCalledWith(0);
    expect(limit).toHaveBeenCalledWith(10);
  });
});

/*
Test coverage:

1. Gets paginated projects ordered by newest first
   → Verifies the repository populates the creator username, sorts
     projects by newest first, calculates the correct skip value for
     page 2, and applies the requested limit.

2. Starts from the first page correctly
   → Verifies page 1 starts with skip(0) and still applies the
     requested page limit.
*/
