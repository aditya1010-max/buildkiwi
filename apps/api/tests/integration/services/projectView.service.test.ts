import { beforeEach, describe, expect, it, jest } from "@jest/globals";

import {
  createProjectView,
  findLatestProjectView,
  incrementProjectViews,
} from "../../../src/repositories/projectView.repository";

import { recordProjectView } from "../../../src/services/projectView.service";

jest.mock("../../../src/repositories/projectView.repository", () => ({
  createProjectView: jest.fn(),
  findLatestProjectView: jest.fn(),
  incrementProjectViews: jest.fn(),
}));

const mockCreateProjectView = jest.mocked(createProjectView);

const mockFindLatestProjectView = jest.mocked(findLatestProjectView);

const mockIncrementProjectViews = jest.mocked(incrementProjectViews);

describe("project view service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("recordProjectView", () => {
    it("records a view and increments the project view count", async () => {
      mockFindLatestProjectView.mockResolvedValue(null);

      mockCreateProjectView.mockResolvedValue({} as never);
      mockIncrementProjectViews.mockResolvedValue({} as never);

      await recordProjectView("project-123", "visitor-123");

      expect(mockFindLatestProjectView).toHaveBeenCalledWith(
        "project-123",
        "visitor-123",
      );

      expect(mockCreateProjectView).toHaveBeenCalledWith(
        "project-123",
        "visitor-123",
      );

      expect(mockIncrementProjectViews).toHaveBeenCalledWith("project-123");
    });

    it("does not record another view within the 24-hour cooldown", async () => {
      const recentView = {
        viewedAt: new Date(Date.now() - 60 * 60 * 1000),
      };

      mockFindLatestProjectView.mockResolvedValue(recentView as never);

      await recordProjectView("project-123", "visitor-123");

      expect(mockFindLatestProjectView).toHaveBeenCalledWith(
        "project-123",
        "visitor-123",
      );

      expect(mockCreateProjectView).not.toHaveBeenCalled();
      expect(mockIncrementProjectViews).not.toHaveBeenCalled();
    });

    it("records a new view after the 24-hour cooldown", async () => {
      const oldView = {
        viewedAt: new Date(Date.now() - 25 * 60 * 60 * 1000),
      };

      mockFindLatestProjectView.mockResolvedValue(oldView as never);

      mockCreateProjectView.mockResolvedValue({} as never);
      mockIncrementProjectViews.mockResolvedValue({} as never);

      await recordProjectView("project-123", "visitor-123");

      expect(mockCreateProjectView).toHaveBeenCalledWith(
        "project-123",
        "visitor-123",
      );

      expect(mockIncrementProjectViews).toHaveBeenCalledWith("project-123");
    });
  });
});

/*
Test coverage:

1. Records a new project view
   → Verifies a view is created and the project's view count is
     incremented when there is no previous view.

2. Respects the 24-hour cooldown
   → Verifies a recent view does not create another view or increment
     the project's view count.

3. Records a view after the cooldown
   → Verifies a new view is recorded when the previous view is older
     than 24 hours.
*/
