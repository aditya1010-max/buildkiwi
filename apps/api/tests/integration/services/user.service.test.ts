import { beforeEach, describe, expect, it, jest } from "@jest/globals";

import {
  createUserRepository,
  findUserByEmailRepository,
  findUserByIdRepository,
  updateUserBioRepository,
} from "../../../src/repositories/user.repository";

import {
  createUserService,
  findUserByEmailService,
  findUserByIdService,
  updateUserBioService,
} from "../../../src/services/user.service";

jest.mock("../../../src/repositories/user.repository", () => ({
  createUserRepository: jest.fn(),
  findUserByEmailRepository: jest.fn(),
  findUserByIdRepository: jest.fn(),
  updateUserBioRepository: jest.fn(),
}));

const mockCreateUser = jest.mocked(createUserRepository);
const mockFindUserByEmail = jest.mocked(findUserByEmailRepository);
const mockFindUserById = jest.mocked(findUserByIdRepository);
const mockUpdateUserBio = jest.mocked(updateUserBioRepository);

describe("user service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createUserService", () => {
    it("creates a user using the provided data", async () => {
      const data = {
        username: "aditya",
        email: "aditya@example.com",
        passwordHash: "hashed-password",
      };

      const user = {
        _id: "user-123",
        ...data,
      };

      mockCreateUser.mockResolvedValue(user as never);

      const result = await createUserService(data);

      expect(mockCreateUser).toHaveBeenCalledWith(data);
      expect(result).toBe(user);
    });
  });

  describe("findUserByEmailService", () => {
    it("finds a user by email", async () => {
      const user = {
        _id: "user-123",
        email: "aditya@example.com",
      };

      mockFindUserByEmail.mockResolvedValue(user as never);

      const result = await findUserByEmailService("aditya@example.com");

      expect(mockFindUserByEmail).toHaveBeenCalledWith("aditya@example.com");

      expect(result).toBe(user);
    });
  });

  describe("findUserByIdService", () => {
    it("finds a user by ID", async () => {
      const user = {
        _id: "user-123",
        username: "aditya",
      };

      mockFindUserById.mockResolvedValue(user as never);

      const result = await findUserByIdService("user-123");

      expect(mockFindUserById).toHaveBeenCalledWith("user-123");

      expect(result).toBe(user);
    });
  });

  describe("updateUserBioService", () => {
    it("updates a user's bio", async () => {
      const updatedUser = {
        _id: "user-123",
        bio: "Full-stack developer",
      };

      mockUpdateUserBio.mockResolvedValue(updatedUser as never);

      const result = await updateUserBioService(
        "user-123",
        "Full-stack developer",
      );

      expect(mockUpdateUserBio).toHaveBeenCalledWith(
        "user-123",
        "Full-stack developer",
      );

      expect(result).toBe(updatedUser);
    });
  });
});

/*
Test coverage:

1. Creates a user
   → Verifies the service passes the provided user data to the
     create-user repository and returns the result.

2. Finds a user by email
   → Verifies the email is passed to the repository and its result
     is returned.

3. Finds a user by ID
   → Verifies the user ID is passed to the repository and its result
     is returned.

4. Updates a user's bio
   → Verifies the user ID and bio are passed to the repository and
     the updated user is returned.
*/
