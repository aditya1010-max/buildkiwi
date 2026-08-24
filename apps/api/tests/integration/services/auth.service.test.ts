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
  registerUserService,
  loginUserService,
} from "../../../src/services/auth.service";

jest.mock("bcrypt", () => ({
  __esModule: true,
  default: {
    hash: jest.fn(),
    compare: jest.fn(),
  },
}));

jest.mock("../../../src/repositories/user.repository", () => ({
  createUserRepository: jest.fn(),
  findUserByEmailRepository: jest.fn(),
}));

jest.mock("../../../src/utils/jwt", () => ({
  generateAccessToken: jest.fn(),
  generateRefreshToken: jest.fn(),
}));

const mockHash = bcrypt.hash as unknown as jest.Mock<
  (password: string, saltOrRounds: number) => Promise<string>
>;

const mockCompare = bcrypt.compare as unknown as jest.Mock<
  (password: string, hash: string) => Promise<boolean>
>;

const mockCreateUser = jest.mocked(createUserRepository);
const mockFindUserByEmail = jest.mocked(findUserByEmailRepository);

const mockGenerateAccessToken = jest.mocked(generateAccessToken);

const mockGenerateRefreshToken = jest.mocked(generateRefreshToken);

describe("auth service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("registerUserService", () => {
    it("registers a new user with a hashed password", async () => {
      const input = {
        username: "aditya",
        email: "aditya@example.com",
        password: "password123",
      };

      const user = {
        _id: "user-123",
        username: "aditya",
        email: "aditya@example.com",
      };

      mockFindUserByEmail.mockResolvedValue(null);

      mockHash.mockResolvedValue("hashed-password");

      mockCreateUser.mockResolvedValue(user as never);

      const result = await registerUserService(input);

      expect(mockFindUserByEmail).toHaveBeenCalledWith(input.email);

      expect(mockHash).toHaveBeenCalledWith(input.password, 10);

      expect(mockCreateUser).toHaveBeenCalledWith({
        username: input.username,
        email: input.email,
        passwordHash: "hashed-password",
      });

      expect(result).toBe(user);
    });

    it("rejects registration when the email already exists", async () => {
      mockFindUserByEmail.mockResolvedValue({
        _id: "user-123",
        email: "aditya@example.com",
      } as never);

      await expect(
        registerUserService({
          username: "aditya",
          email: "aditya@example.com",
          password: "password123",
        }),
      ).rejects.toThrow("User already exists");

      expect(mockHash).not.toHaveBeenCalled();
      expect(mockCreateUser).not.toHaveBeenCalled();
    });
  });

  describe("loginUserService", () => {
    it("logs in a user with valid credentials", async () => {
      const user = {
        _id: {
          toString: () => "user-123",
        },
        email: "aditya@example.com",
        passwordHash: "hashed-password",
      };

      mockFindUserByEmail.mockResolvedValue(user as never);

      mockCompare.mockResolvedValue(true);

      mockGenerateAccessToken.mockReturnValue("access-token");

      mockGenerateRefreshToken.mockReturnValue("refresh-token");

      const result = await loginUserService(
        "aditya@example.com",
        "password123",
      );

      expect(mockFindUserByEmail).toHaveBeenCalledWith("aditya@example.com");

      expect(mockCompare).toHaveBeenCalledWith(
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
        loginUserService("aditya@example.com", "password123"),
      ).rejects.toThrow("Invalid credentials");

      expect(mockCompare).not.toHaveBeenCalled();
      expect(mockGenerateAccessToken).not.toHaveBeenCalled();
      expect(mockGenerateRefreshToken).not.toHaveBeenCalled();
    });

    it("rejects login when the password is incorrect", async () => {
      const user = {
        _id: {
          toString: () => "user-123",
        },
        email: "aditya@example.com",
        passwordHash: "hashed-password",
      };

      mockFindUserByEmail.mockResolvedValue(user as never);

      mockCompare.mockResolvedValue(false);

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

1. Registers a new user
   → Verifies an existing user is checked first, the password is hashed
     with bcrypt, and the repository receives the hashed password.

2. Rejects duplicate registration
   → Verifies an existing email prevents password hashing and user
     creation.

3. Logs in with valid credentials
   → Verifies the password is compared, the correct JWT payload is
     generated, and both access and refresh tokens are returned.

4. Rejects login for a missing user
   → Verifies invalid credentials are returned without attempting
     password comparison or token generation.

5. Rejects login for an incorrect password
   → Verifies invalid credentials are returned and no tokens are
     generated when bcrypt comparison fails.
*/
