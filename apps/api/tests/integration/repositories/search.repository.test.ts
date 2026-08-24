import { beforeEach, describe, expect, it, jest } from "@jest/globals";

import { Project } from "../../../src/models/project.model";

import { searchProjectsRepository } from "../../../src/repositories/search.repository";

jest.mock("../../../src/models/project.model", () => ({
  Project: {
    find: jest.fn(),
  },
}));

const mockFind = jest.mocked(Project.find);

describe("search repository", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("searches projects with text search and pagination", async () => {
    const projects = [
      {
        _id: "project-123",
        title: "BuildKiwi",
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

    const populate = jest
      .fn<
        (
          path: string,
          select: string,
        ) => {
          skip: typeof skip;
        }
      >()
      .mockReturnValue({
        skip,
      });

    mockFind.mockReturnValue({
      populate,
    } as unknown as ReturnType<typeof Project.find>);

    const result = await searchProjectsRepository("react", 2, 10);

    expect(mockFind).toHaveBeenCalledWith({
      $text: {
        $search: "react",
      },
    });

    expect(populate).toHaveBeenCalledWith("creatorId", "username");

    expect(skip).toHaveBeenCalledWith(10);

    expect(limit).toHaveBeenCalledWith(10);

    expect(result).toBe(projects);
  });

  it("starts pagination at zero for the first page", async () => {
    const projects: unknown[] = [];

    const limit = jest.fn<(value: number) => Promise<typeof projects>>();
    limit.mockResolvedValue(projects);

    const skip = jest.fn().mockReturnValue({
      limit,
    });

    const populate = jest.fn().mockReturnValue({
      skip,
    });

    mockFind.mockReturnValue({
      populate,
    } as unknown as ReturnType<typeof Project.find>);

    await searchProjectsRepository("typescript", 1, 10);

    expect(skip).toHaveBeenCalledWith(0);
    expect(limit).toHaveBeenCalledWith(10);
  });
});

/*
Test coverage:

1. Searches projects with text search and pagination
   → Verifies the repository uses MongoDB's $text/$search query,
     populates the creator username, calculates the correct pagination
     offset, and applies the requested limit.

2. Starts pagination at zero for the first page
   → Verifies the first page uses skip(0) while still applying the
     requested limit.
*/
