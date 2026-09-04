import { beforeEach, describe, expect, it, jest } from "@jest/globals";

import bcrypt from "bcrypt";

import {
  createUserRepository,
  findUserByEmailRepository,
} from "../../../src/repositories/user.repository";

import {
  generateAccessToken,
  generateRefreshToken,
} from "../../../src/utils/jwt";

import {
  loginUserService,
  registerUserService,
} from "../../../src/services/auth.service";

jest.mock("bcrypt");

jest.mock("../../../src/repositories/user.repository", () => ({
  createUserRepository: jest.fn(),
  findUserByEmailRepository: jest.fn(),
}));

jest.mock("../../../src/utils/jwt", () => ({
  generateAccessToken: jest.fn(),
  generateRefreshToken: jest.fn(),
}));

const mockFindUserByEmail = jest.mocked(findUserByEmailRepository);
const mockCreateUser = jest.mocked(createUserRepository);
const mockBcryptHash = jest.mocked(bcrypt.hash);
const mockBcryptCompare = jest.mocked(bcrypt.compare);
const mockGenerateAccessToken = jest.mocked(generateAccessToken);
const mockGenerateRefreshToken = jest.mocked(generateRefreshToken);

describe("auth service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("registerUserService", () => {
    it("creates a user when the email is not already registered", async () => {
      const user = {
        _id: "user-123",
        username: "aditya",
        email: "aditya@example.com",
        passwordHash: "hashed-password",
      };

      mockFindUserByEmail.mockResolvedValue(null);
      mockBcryptHash.mockResolvedValue("hashed-password" as never);
      mockCreateUser.mockResolvedValue(user as never);

      const result = await registerUserService({
        username: "aditya",
        email: "aditya@example.com",
        password: "password123",
      });

      expect(mockFindUserByEmail).toHaveBeenCalledWith("aditya@example.com");

      expect(mockBcryptHash).toHaveBeenCalledWith("password123", 10);

      expect(mockCreateUser).toHaveBeenCalledWith({
        username: "aditya",
        email: "aditya@example.com",
        passwordHash: "hashed-password",
        avatarSeed: expect.any(String),
        avatarPattern: "blobs",
      });

      expect(result).toBe(user);
    });

    it("rejects registration when the email already exists", async () => {
      mockFindUserByEmail.mockResolvedValue({
        email: "aditya@example.com",
      } as never);

      await expect(
        registerUserService({
          username: "aditya",
          email: "aditya@example.com",
          password: "password123",
        }),
      ).rejects.toThrow("User already exists");

      expect(mockBcryptHash).not.toHaveBeenCalled();
      expect(mockCreateUser).not.toHaveBeenCalled();
    });
  });

  describe("loginUserService", () => {
    const user = {
      _id: {
        toString: () => "user-123",
      },
      email: "aditya@example.com",
      passwordHash: "hashed-password",
    };

    it("logs in a user with valid credentials", async () => {
      mockFindUserByEmail.mockResolvedValue(user as never);
      mockBcryptCompare.mockResolvedValue(true as never);
      mockGenerateAccessToken.mockReturnValue("access-token");
      mockGenerateRefreshToken.mockReturnValue("refresh-token");

      const result = await loginUserService(
        "aditya@example.com",
        "password123",
      );

      expect(mockFindUserByEmail).toHaveBeenCalledWith("aditya@example.com");

      expect(mockBcryptCompare).toHaveBeenCalledWith(
        "password123",
        "hashed-password",
      );

      expect(mockGenerateAccessToken).toHaveBeenCalledWith({
        userId: "user-123",
        email: "aditya@example.com",
      });

      expect(mockGenerateRefreshToken).toHaveBeenCalledWith({
        userId: "user-123",
        email: "aditya@example.com",
      });

      expect(result).toEqual({
        user,
        accessToken: "access-token",
        refreshToken: "refresh-token",
      });
    });

    it("rejects login when the user does not exist", async () => {
      mockFindUserByEmail.mockResolvedValue(null);

      await expect(
        loginUserService("unknown@example.com", "password123"),
      ).rejects.toThrow("Invalid credentials");

      expect(mockBcryptCompare).not.toHaveBeenCalled();
      expect(mockGenerateAccessToken).not.toHaveBeenCalled();
      expect(mockGenerateRefreshToken).not.toHaveBeenCalled();
    });

    it("rejects login when the password is incorrect", async () => {
      mockFindUserByEmail.mockResolvedValue(user as never);
      mockBcryptCompare.mockResolvedValue(false as never);

      await expect(
        loginUserService("aditya@example.com", "wrong-password"),
      ).rejects.toThrow("Invalid credentials");

      expect(mockGenerateAccessToken).not.toHaveBeenCalled();
      expect(mockGenerateRefreshToken).not.toHaveBeenCalled();
    });
  });
});

/*
Test coverage:

1. Creates a user when the email is not already registered
   → Verifies registration checks for an existing user, hashes the
     password, and passes the hashed password to the repository.

2. Rejects registration when the email already exists
   → Verifies duplicate registration stops before password hashing and
     user creation.

3. Logs in a user with valid credentials
   → Verifies a valid user/password combination produces the expected
     access token and refresh token payload.

4. Rejects login when the user does not exist
   → Verifies unknown users receive an invalid-credentials error and
     token generation does not occur.

5. Rejects login when the password is incorrect
   → Verifies an incorrect password produces an invalid-credentials
     error and prevents token generation.
*/
