import { beforeEach, describe, expect, it, jest } from "@jest/globals";

import { User } from "../../../src/models/user.model";

import {
  createUserRepository,
  findUserByEmailRepository,
  findUserByIdRepository,
  saveProjectRepository,
  unsaveProjectRepository,
  getSavedProjectsRepository,
  updateUserProfileRepository,
} from "../../../src/repositories/user.repository";

jest.mock("../../../src/models/user.model", () => ({
  User: {
    create: jest.fn(),
    findOne: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
  },
}));

const mockCreate = jest.mocked(User.create);
const mockFindOne = jest.mocked(User.findOne);
const mockFindById = jest.mocked(User.findById);
const mockFindByIdAndUpdate = jest.mocked(User.findByIdAndUpdate);

describe("user repository", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createUserRepository", () => {
    it("creates a user with the provided data", async () => {
      const data = {
        username: "aditya",
        email: "aditya@example.com",
        passwordHash: "hashed-password",
        avatarSeed: "avatar-test-seed",
        avatarPattern: "blobs" as const,
      };

      const user = {
        _id: "user-123",
        ...data,
      };

      mockCreate.mockResolvedValue(user as never);

      const result = await createUserRepository(data);

      expect(mockCreate).toHaveBeenCalledWith(data);
      expect(result).toBe(user);
    });
  });

  describe("findUserByEmailRepository", () => {
    it("finds a user by email", async () => {
      const user = {
        _id: "user-123",
        email: "aditya@example.com",
      };

      mockFindOne.mockResolvedValue(user as never);

      const result = await findUserByEmailRepository("aditya@example.com");

      expect(mockFindOne).toHaveBeenCalledWith({
        email: "aditya@example.com",
      });

      expect(result).toBe(user);
    });
  });

  describe("findUserByIdRepository", () => {
    it("finds a user by ID without returning the password hash", async () => {
      const user = {
        _id: "user-123",
        username: "aditya",
      };

      const select = jest.fn<(fields: string) => Promise<typeof user>>();

      select.mockResolvedValue(user);

      mockFindById.mockReturnValue({
        select,
      } as unknown as ReturnType<typeof User.findById>);

      const result = await findUserByIdRepository("user-123");

      expect(mockFindById).toHaveBeenCalledWith("user-123");

      expect(select).toHaveBeenCalledWith("-passwordHash -__v");

      expect(result).toBe(user);
    });
  });

  describe("saveProjectRepository", () => {
    it("adds a project to the user's saved projects", async () => {
      const updatedUser = {
        _id: "user-123",
        savedProjects: ["project-123"],
      };

      mockFindByIdAndUpdate.mockResolvedValue(updatedUser as never);

      const result = await saveProjectRepository("user-123", "project-123");

      expect(mockFindByIdAndUpdate).toHaveBeenCalledWith(
        "user-123",
        {
          $addToSet: {
            savedProjects: "project-123",
          },
        },
        {
          new: true,
        },
      );

      expect(result).toBe(updatedUser);
    });
  });

  describe("unsaveProjectRepository", () => {
    it("removes a project from the user's saved projects", async () => {
      const updatedUser = {
        _id: "user-123",
        savedProjects: [],
      };

      mockFindByIdAndUpdate.mockResolvedValue(updatedUser as never);

      const result = await unsaveProjectRepository("user-123", "project-123");

      expect(mockFindByIdAndUpdate).toHaveBeenCalledWith(
        "user-123",
        {
          $pull: {
            savedProjects: "project-123",
          },
        },
        {
          new: true,
        },
      );

      expect(result).toBe(updatedUser);
    });
  });

  describe("getSavedProjectsRepository", () => {
    it("returns populated saved projects", async () => {
      const savedProjects = [
        {
          _id: "project-123",
          title: "BuildKiwi",
          creatorId: {
            username: "aditya",
          },
        },
      ];

      const populate = jest.fn<
        (options: {
          path: string;
          populate: {
            path: string;
            select: string;
          };
        }) => Promise<void>
      >();

      populate.mockResolvedValue(undefined);

      const user = {
        _id: "user-123",
        savedProjects,
        populate,
      };

      mockFindById.mockResolvedValue(user as never);

      const result = await getSavedProjectsRepository("user-123");

      expect(mockFindById).toHaveBeenCalledWith("user-123");

      expect(user.populate).toHaveBeenCalledWith({
        path: "savedProjects",
        populate: {
          path: "creatorId",
          select: "username avatarSeed avatarPattern",
        },
      });

      expect(result).toBe(savedProjects);
    });

    it("throws when the user does not exist", async () => {
      mockFindById.mockResolvedValue(null);

      await expect(getSavedProjectsRepository("user-123")).rejects.toThrow(
        "User not found",
      );

      expect(mockFindById).toHaveBeenCalledWith("user-123");
    });
  });

  describe("updateUserProfileRepository", () => {
    it("updates the user's profile with validation enabled", async () => {
      const data = {
        bio: "Full-stack developer",
        avatarSeed: "avatar-new-seed",
        avatarPattern: "geometric" as const,
      };

      const updatedUser = {
        _id: "user-123",
        ...data,
      };

      const select = jest.fn<(fields: string) => Promise<typeof updatedUser>>();

      select.mockResolvedValue(updatedUser);

      mockFindByIdAndUpdate.mockReturnValue({
        select,
      } as unknown as ReturnType<typeof User.findByIdAndUpdate>);

      const result = await updateUserProfileRepository("user-123", data);

      expect(mockFindByIdAndUpdate).toHaveBeenCalledWith(
        "user-123",
        {
          $set: data,
        },
        {
          new: true,
          runValidators: true,
        },
      );

      expect(select).toHaveBeenCalledWith("-passwordHash -__v");

      expect(result).toBe(updatedUser);
    });
  });
});

/*
Test coverage:

1. Creates a user
   → Verifies the provided username, email, password hash, avatar seed,
     and avatar pattern are passed to User.create().

2. Finds a user by email
   → Verifies User.findOne() uses the provided email.

3. Finds a user by ID
   → Verifies the user is found by ID and passwordHash/__v are excluded
     from the selected fields.

4. Saves a project
   → Verifies $addToSet is used so the project is added to savedProjects
     without creating duplicate entries.

5. Unsaves a project
   → Verifies $pull removes the project from savedProjects.

6. Gets saved projects
   → Verifies the user is found, saved projects are populated, creator
     usernames are populated, and the populated array is returned.

7. Handles a missing user
   → Verifies the repository throws "User not found" when no user exists.

8. Updates user profile
   → Verifies bio, avatar seed, and avatar pattern are updated through
     $set with Mongoose validators enabled.
*/
