import { beforeEach, describe, expect, it, jest } from "@jest/globals";

import { Project } from "../../../src/models/project.model";

import {
  getEditableProjectById,
  projectRepository,
} from "../../../src/repositories/project.repository";

jest.mock("../../../src/models/project.model", () => ({
  Project: {
    create: jest.fn(),
    find: jest.fn(),
    countDocuments: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    findOne: jest.fn(),
  },
}));

const mockCreate = jest.mocked(Project.create);
const mockFind = jest.mocked(Project.find);
const mockCountDocuments = jest.mocked(Project.countDocuments);
const mockFindById = jest.mocked(Project.findById);
const mockFindByIdAndUpdate = jest.mocked(Project.findByIdAndUpdate);
const mockFindByIdAndDelete = jest.mocked(Project.findByIdAndDelete);
const mockFindOne = jest.mocked(Project.findOne);

describe("project repository", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    it("creates a project with the provided data", async () => {
      const data = {
        title: "BuildKiwi",
        description: "Developer platform",
        tags: ["React", "Node"],
        links: {},
      };

      const project = {
        _id: "project-123",
        ...data,
      };

      mockCreate.mockResolvedValue(project as never);

      const result = await projectRepository.create(data);

      expect(mockCreate).toHaveBeenCalledWith(data);
      expect(result).toBe(project);
    });
  });

  describe("findAll", () => {
    it("gets projects with pagination and no search filter", async () => {
      const projects = [{ _id: "project-1" }];

      const lean = jest.fn<() => Promise<typeof projects>>();
      lean.mockResolvedValue(projects);

      const limit = jest
        .fn<(value: number) => { lean: typeof lean }>()
        .mockReturnValue({ lean });

      const skip = jest
        .fn<(value: number) => { limit: typeof limit }>()
        .mockReturnValue({ limit });

      const sort = jest
        .fn<(value: { createdAt: -1 }) => { skip: typeof skip }>()
        .mockReturnValue({ skip });

      const populate = jest
        .fn<(path: string, select: string) => { sort: typeof sort }>()
        .mockReturnValue({ sort });

      mockFind.mockReturnValue({
        populate,
      } as unknown as ReturnType<typeof Project.find>);

      const result = await projectRepository.findAll({
        page: 2,
        limit: 10,
      });

      expect(mockFind).toHaveBeenCalledWith({});

      expect(populate).toHaveBeenCalledWith("creatorId", "username");

      expect(sort).toHaveBeenCalledWith({
        createdAt: -1,
      });

      expect(skip).toHaveBeenCalledWith(10);
      expect(limit).toHaveBeenCalledWith(10);
      expect(lean).toHaveBeenCalled();

      expect(result).toBe(projects);
    });

    it("searches projects by title and description", async () => {
      const projects: unknown[] = [];

      const lean = jest.fn<() => Promise<typeof projects>>();
      lean.mockResolvedValue(projects);

      const limit = jest.fn().mockReturnValue({ lean });
      const skip = jest.fn().mockReturnValue({ limit });
      const sort = jest.fn().mockReturnValue({ skip });
      const populate = jest.fn().mockReturnValue({ sort });

      mockFind.mockReturnValue({
        populate,
      } as unknown as ReturnType<typeof Project.find>);

      await projectRepository.findAll({
        page: 1,
        limit: 10,
        query: "  react  ",
        filter: "projects",
      });

      const query = mockFind.mock.calls[0][0] as unknown as {
        $or: Array<Record<string, RegExp>>;
      };

      expect(query.$or).toHaveLength(2);
      expect(query.$or[0].title).toEqual(new RegExp("react", "i"));
      expect(query.$or[1].description).toEqual(new RegExp("react", "i"));
    });

    it("searches projects by tags", async () => {
      const projects: unknown[] = [];

      const lean = jest.fn<() => Promise<typeof projects>>();
      lean.mockResolvedValue(projects);

      const limit = jest.fn().mockReturnValue({ lean });
      const skip = jest.fn().mockReturnValue({ limit });
      const sort = jest.fn().mockReturnValue({ skip });
      const populate = jest.fn().mockReturnValue({ sort });

      mockFind.mockReturnValue({
        populate,
      } as unknown as ReturnType<typeof Project.find>);

      await projectRepository.findAll({
        page: 1,
        limit: 10,
        query: "react",
        filter: "tags",
      });

      const query = mockFind.mock.calls[0][0] as unknown as {
        tags: RegExp;
      };

      expect(query.tags).toEqual(new RegExp("react", "i"));
    });

    it("searches across title, description, and tags by default", async () => {
      const projects: unknown[] = [];

      const lean = jest.fn<() => Promise<typeof projects>>();
      lean.mockResolvedValue(projects);

      const limit = jest.fn().mockReturnValue({ lean });
      const skip = jest.fn().mockReturnValue({ limit });
      const sort = jest.fn().mockReturnValue({ skip });
      const populate = jest.fn().mockReturnValue({ sort });

      mockFind.mockReturnValue({
        populate,
      } as unknown as ReturnType<typeof Project.find>);

      await projectRepository.findAll({
        page: 1,
        limit: 10,
        query: "node",
        filter: "all",
      });

      const query = mockFind.mock.calls[0][0] as unknown as {
        $or: Array<Record<string, RegExp>>;
      };

      expect(query.$or).toHaveLength(3);
      expect(query.$or[0].title).toEqual(new RegExp("node", "i"));
      expect(query.$or[1].description).toEqual(new RegExp("node", "i"));
      expect(query.$or[2].tags).toEqual(new RegExp("node", "i"));
    });
  });

  describe("count", () => {
    it("counts all projects", async () => {
      mockCountDocuments.mockResolvedValue(25);

      const result = await projectRepository.count();

      expect(mockCountDocuments).toHaveBeenCalledWith();
      expect(result).toBe(25);
    });
  });

  describe("findByUserId", () => {
    it("finds a user's projects ordered by newest first", async () => {
      const projects = [{ _id: "project-1" }];

      const lean = jest.fn<() => Promise<typeof projects>>();
      lean.mockResolvedValue(projects);

      const sort = jest.fn().mockReturnValue({ lean });

      const populate = jest.fn().mockReturnValue({ sort });

      mockFind.mockReturnValue({
        populate,
      } as unknown as ReturnType<typeof Project.find>);

      const result = await projectRepository.findByUserId("user-123");

      expect(mockFind).toHaveBeenCalledWith({
        creatorId: "user-123",
      });

      expect(populate).toHaveBeenCalledWith("creatorId", "username");

      expect(sort).toHaveBeenCalledWith({
        createdAt: -1,
      });

      expect(lean).toHaveBeenCalled();

      expect(result).toBe(projects);
    });
  });

  describe("findById", () => {
    it("finds a project by ID with creator information", async () => {
      const project = {
        _id: "project-123",
        title: "BuildKiwi",
      };

      const lean = jest.fn<() => Promise<typeof project>>();
      lean.mockResolvedValue(project);

      const populate = jest.fn().mockReturnValue({ lean });

      mockFindById.mockReturnValue({
        populate,
      } as unknown as ReturnType<typeof Project.findById>);

      const result = await projectRepository.findById("project-123");

      expect(mockFindById).toHaveBeenCalledWith("project-123");

      expect(populate).toHaveBeenCalledWith("creatorId", "username");

      expect(lean).toHaveBeenCalled();

      expect(result).toBe(project);
    });
  });

  describe("findByIdForUpdate", () => {
    it("finds a project by ID without using lean", async () => {
      const project = {
        _id: "project-123",
      };

      mockFindById.mockResolvedValue(project as never);

      const result = await projectRepository.findByIdForUpdate("project-123");

      expect(mockFindById).toHaveBeenCalledWith("project-123");

      expect(result).toBe(project);
    });
  });

  describe("update", () => {
    it("updates a project and returns the updated document", async () => {
      const updateData = {
        title: "Updated BuildKiwi",
      };

      const updatedProject = {
        _id: "project-123",
        title: "Updated BuildKiwi",
      };

      mockFindByIdAndUpdate.mockResolvedValue(updatedProject as never);

      const result = await projectRepository.update("project-123", updateData);

      expect(mockFindByIdAndUpdate).toHaveBeenCalledWith(
        "project-123",
        {
          $set: updateData,
        },
        {
          returnDocument: "after",
          runValidators: true,
        },
      );

      expect(result).toBe(updatedProject);
    });
  });

  describe("delete", () => {
    it("returns true when a project is deleted", async () => {
      const project = {
        _id: "project-123",
      };

      mockFindByIdAndDelete.mockResolvedValue(project as never);

      const result = await projectRepository.delete("project-123");

      expect(mockFindByIdAndDelete).toHaveBeenCalledWith("project-123");

      expect(result).toBe(true);
    });

    it("returns false when the project does not exist", async () => {
      mockFindByIdAndDelete.mockResolvedValue(null);

      const result = await projectRepository.delete("project-123");

      expect(result).toBe(false);
    });
  });

  describe("getEditableProjectById", () => {
    it("finds a project owned by the authenticated user", async () => {
      const project = {
        _id: "project-123",
        creatorId: "user-123",
      };

      mockFindOne.mockResolvedValue(project as never);

      const result = await getEditableProjectById("project-123", "user-123");

      expect(mockFindOne).toHaveBeenCalledWith({
        _id: "project-123",
        creatorId: "user-123",
      });

      expect(result).toBe(project);
    });
  });
});

/*
Test coverage:

1. Creates a project
   → Verifies project data is passed to Project.create().

2. Finds all projects without a search
   → Verifies pagination, creator population, newest-first sorting,
     and lean results.

3. Searches projects and descriptions
   → Verifies the "projects" filter searches title and description
     using a case-insensitive regular expression.

4. Searches by tags
   → Verifies the "tags" filter searches the tags field.

5. Searches all project fields
   → Verifies the default search checks title, description, and tags.

6. Counts projects
   → Verifies Project.countDocuments() is called and its result is
     returned.

7. Finds projects by user
   → Verifies projects are filtered by creator, populated with the
     creator username, and sorted newest first.

8. Finds a project by ID
   → Verifies the project is found by ID, creator information is
     populated, and the result is converted to a lean object.

9. Finds a project for update
   → Verifies the repository returns the Mongoose document without
     calling lean(), allowing callers to modify and save it.

10. Updates a project
    → Verifies $set is used, validators are enabled, and the updated
      document is requested.

11. Deletes an existing project
    → Verifies deletion returns true when a document is found.

12. Deletes a missing project
    → Verifies deletion returns false when no document is found.

13. Finds an editable project
    → Verifies both project ID and creator ID are required, preventing
      access to another user's project.
*/
