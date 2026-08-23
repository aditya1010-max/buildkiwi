import { beforeEach, describe, expect, it, jest } from "@jest/globals";

import { searchProjectsRepository } from "../../../src/repositories/search.repository";

import { searchProjectsService } from "../../../src/services/search.service";

jest.mock("../../../src/repositories/search.repository", () => ({
  searchProjectsRepository: jest.fn(),
}));

const mockSearchProjects = jest.mocked(searchProjectsRepository);

describe("search service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns search results for the provided query and pagination", async () => {
    const results = {
      projects: [
        {
          _id: "project-1",
          title: "React Dashboard",
        },
      ],
      pagination: {
        page: 1,
        limit: 10,
        total: 1,
      },
    };

    mockSearchProjects.mockResolvedValue(results as never);

    const result = await searchProjectsService("react", 1, 10);

    expect(mockSearchProjects).toHaveBeenCalledWith("react", 1, 10);
    expect(result).toBe(results);
  });
});

/*
Test coverage:

1. Returns search results for the provided query and pagination
   → Verifies the search query, page, and limit are passed correctly
     to the repository and that the repository result is returned.
*/
