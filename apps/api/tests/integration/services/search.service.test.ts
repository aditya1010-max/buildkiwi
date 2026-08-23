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

  describe("searchProjectsService", () => {
    it("searches projects using the provided query and pagination", async () => {
      const projects = [
        {
          _id: "project-1",
          title: "BuildKiwi",
        },
      ];

      mockSearchProjects.mockResolvedValue(projects as never);

      const result = await searchProjectsService("react", 2, 10);

      expect(mockSearchProjects).toHaveBeenCalledWith("react", 2, 10);

      expect(result).toBe(projects);
    });
  });
});

/*
Test coverage:

1. Searches projects
   → Verifies the service passes the search query, page, and limit
     to the search repository and returns the repository result.
*/
