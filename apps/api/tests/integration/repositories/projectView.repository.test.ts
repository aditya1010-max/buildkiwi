import { beforeEach, describe, expect, it, jest } from "@jest/globals";

import { ProjectView } from "../../../src/models/projectView.model";
import { Project } from "../../../src/models/project.model";

import {
  findLatestProjectView,
  createProjectView,
  incrementProjectViews,
} from "../../../src/repositories/projectView.repository";

jest.mock("../../../src/models/projectView.model", () => ({
  ProjectView: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

jest.mock("../../../src/models/project.model", () => ({
  Project: {
    findByIdAndUpdate: jest.fn(),
  },
}));

const mockFindOne = jest.mocked(ProjectView.findOne);
const mockCreate = jest.mocked(ProjectView.create);
const mockFindByIdAndUpdate = jest.mocked(Project.findByIdAndUpdate);

describe("project view repository", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("findLatestProjectView", () => {
    it("finds the latest view for a project and visitor", async () => {
      const view = {
        projectId: "project-123",
        visitorId: "visitor-123",
      };

      const sort =
        jest.fn<(options: { viewedAt: -1 }) => Promise<typeof view>>();

      sort.mockResolvedValue(view);

      mockFindOne.mockReturnValue({
        sort,
      } as unknown as ReturnType<typeof ProjectView.findOne>);

      const result = await findLatestProjectView("project-123", "visitor-123");

      expect(mockFindOne).toHaveBeenCalledWith({
        projectId: "project-123",
        visitorId: "visitor-123",
      });

      expect(sort).toHaveBeenCalledWith({
        viewedAt: -1,
      });

      expect(result).toBe(view);
    });
  });

  describe("createProjectView", () => {
    it("creates a project view for a visitor", async () => {
      const view = {
        projectId: "project-123",
        visitorId: "visitor-123",
      };

      mockCreate.mockResolvedValue(view as never);

      const result = await createProjectView("project-123", "visitor-123");

      expect(mockCreate).toHaveBeenCalledWith({
        projectId: "project-123",
        visitorId: "visitor-123",
      });

      expect(result).toBe(view);
    });
  });

  describe("incrementProjectViews", () => {
    it("increments the project's view count", async () => {
      const updatedProject = {
        _id: "project-123",
      };

      mockFindByIdAndUpdate.mockResolvedValue(updatedProject as never);

      const result = await incrementProjectViews("project-123");

      expect(mockFindByIdAndUpdate).toHaveBeenCalledWith("project-123", {
        $inc: {
          "stats.views": 1,
        },
      });

      expect(result).toBe(updatedProject);
    });
  });
});

/*
Test coverage:

1. Finds the latest project view
   → Verifies the repository searches by project and visitor and sorts
     views by viewedAt descending so the newest view is returned.

2. Creates a project view
   → Verifies the project ID and visitor ID are passed to
     ProjectView.create().

3. Increments project views
   → Verifies the repository increments stats.views by exactly one for
     the requested project.
*/
