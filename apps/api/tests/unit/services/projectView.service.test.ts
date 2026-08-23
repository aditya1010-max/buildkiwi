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

const mockFindLatestProjectView = jest.mocked(findLatestProjectView);
const mockCreateProjectView = jest.mocked(createProjectView);
const mockIncrementProjectViews = jest.mocked(incrementProjectViews);

describe("project view service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("records a view when the visitor has no previous view", async () => {
    mockFindLatestProjectView.mockResolvedValue(null);
    mockCreateProjectView.mockResolvedValue({} as never);
    mockIncrementProjectViews.mockResolvedValue(undefined as never);

    await recordProjectView("project-123", "user-123");

    expect(mockFindLatestProjectView).toHaveBeenCalledWith(
      "project-123",
      "user-123",
    );

    expect(mockCreateProjectView).toHaveBeenCalledWith(
      "project-123",
      "user-123",
    );

    expect(mockIncrementProjectViews).toHaveBeenCalledWith("project-123");
  });

  it("does not record a view within the 24-hour cooldown", async () => {
    const recentView = {
      viewedAt: new Date(Date.now() - 60 * 60 * 1000),
    };

    mockFindLatestProjectView.mockResolvedValue(recentView as never);

    await recordProjectView("project-123", "user-123");

    expect(mockCreateProjectView).not.toHaveBeenCalled();
    expect(mockIncrementProjectViews).not.toHaveBeenCalled();
  });

  it("records a new view after the 24-hour cooldown", async () => {
    const oldView = {
      viewedAt: new Date(Date.now() - 25 * 60 * 60 * 1000),
    };

    mockFindLatestProjectView.mockResolvedValue(oldView as never);
    mockCreateProjectView.mockResolvedValue({} as never);
    mockIncrementProjectViews.mockResolvedValue(undefined as never);

    await recordProjectView("project-123", "user-123");

    expect(mockCreateProjectView).toHaveBeenCalledWith(
      "project-123",
      "user-123",
    );

    expect(mockIncrementProjectViews).toHaveBeenCalledWith("project-123");
  });
});

/*
Test coverage:

1. Records a view when there is no previous view
   → Verifies a first-time visitor creates a project-view record and
     increments the project's view count.

2. Does not record a view within the 24-hour cooldown
   → Verifies a recent view prevents both creating another view record
     and incrementing the project's view count.

3. Records a new view after the 24-hour cooldown
   → Verifies a visitor can generate another view after the cooldown
     period has expired.
*/
