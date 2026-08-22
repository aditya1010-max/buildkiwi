import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import express from "express";
import cookieParser from "cookie-parser";
import request from "supertest";

import authRouter from "../../../src/routes/auth.routes";

import {
  registerUserService,
  loginUserService,
} from "../../../src/services/auth.service";

import { findUserByIdService } from "../../../src/services/user.service";
import { errorHandler } from "../../../src/middleware/errorHandler";

import {
  verifyRefreshToken,
  generateAccessToken,
} from "../../../src/utils/jwt";

jest.mock("../../../src/services/auth.service", () => ({
  registerUserService: jest.fn(),
  loginUserService: jest.fn(),
}));

jest.mock("../../../src/services/user.service", () => ({
  findUserByIdService: jest.fn(),
}));

jest.mock("../../../src/utils/jwt", () => ({
  verifyRefreshToken: jest.fn(),
  generateAccessToken: jest.fn(),
}));

jest.mock("../../../src/middleware/auth.middleware", () => ({
  authMiddleware: (req: any, _res: any, next: any) => {
    req.user = {
      userId: "user-123",
      email: "aditya@example.com",
    };

    next();
  },
}));

const mockRegisterUser = jest.mocked(registerUserService);
const mockLoginUser = jest.mocked(loginUserService);
const mockFindUserById = jest.mocked(findUserByIdService);

const mockVerifyRefreshToken = jest.mocked(verifyRefreshToken);

const mockGenerateAccessToken = jest.mocked(generateAccessToken);

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use("/auth", authRouter);

app.use(errorHandler);

describe("auth HTTP", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /auth/register", () => {
    it("registers a user successfully", async () => {
      const user = {
        _id: "user-123",
        username: "aditya",
        email: "aditya@example.com",
      };

      mockRegisterUser.mockResolvedValue(user as never);

      const response = await request(app).post("/auth/register").send({
        username: "aditya",
        email: "aditya@example.com",
        password: "password123",
      });

      expect(response.status).toBe(201);

      expect(response.body).toEqual({
        success: true,
        user,
      });

      expect(mockRegisterUser).toHaveBeenCalledWith({
        username: "aditya",
        email: "aditya@example.com",
        password: "password123",
      });
    });

    it("returns an error when registration fails", async () => {
      mockRegisterUser.mockRejectedValue(new Error("User already exists"));

      const response = await request(app).post("/auth/register").send({
        username: "aditya",
        email: "aditya@example.com",
        password: "password123",
      });

      expect(response.status).toBe(500);

      expect(response.body).toEqual({
        success: false,
        message: "User already exists",
      });
    });
  });

  describe("POST /auth/login", () => {
    it("logs in successfully and sets the refresh cookie", async () => {
      const user = {
        _id: "user-123",
        username: "aditya",
        email: "aditya@example.com",
      };

      mockLoginUser.mockResolvedValue({
        user,
        accessToken: "access-token",
        refreshToken: "refresh-token",
      } as never);

      const response = await request(app).post("/auth/login").send({
        email: "aditya@example.com",
        password: "password123",
      });

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        success: true,
        user,
        accessToken: "access-token",
      });

      expect(response.headers["set-cookie"]).toEqual(
        expect.arrayContaining([
          expect.stringContaining("refreshToken=refresh-token"),
        ]),
      );

      expect(mockLoginUser).toHaveBeenCalledWith(
        "aditya@example.com",
        "password123",
      );
    });

    it("returns an error for invalid credentials", async () => {
      mockLoginUser.mockRejectedValue(new Error("Invalid credentials"));

      const response = await request(app).post("/auth/login").send({
        email: "aditya@example.com",
        password: "wrong-password",
      });

      expect(response.status).toBe(500);

      expect(response.body).toEqual({
        success: false,
        message: "Invalid credentials",
      });
    });
  });

  describe("GET /auth/me", () => {
    it("returns the authenticated user", async () => {
      const user = {
        _id: "user-123",
        username: "aditya",
        email: "aditya@example.com",
      };

      mockFindUserById.mockResolvedValue(user as never);

      const response = await request(app)
        .get("/auth/me")
        .set("Authorization", "Bearer valid-access-token");

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        success: true,
        user,
      });

      expect(mockFindUserById).toHaveBeenCalledWith(expect.any(String));
    });
  });

  describe("POST /auth/refresh", () => {
    it("generates a new access token using the refresh token", async () => {
      mockVerifyRefreshToken.mockReturnValue({
        userId: "user-123",
        email: "aditya@example.com",
      });

      mockGenerateAccessToken.mockReturnValue("new-access-token");

      const response = await request(app)
        .post("/auth/refresh")
        .set("Cookie", "refreshToken=valid-refresh-token");

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        success: true,
        accessToken: "new-access-token",
      });

      expect(mockVerifyRefreshToken).toHaveBeenCalledWith(
        "valid-refresh-token",
      );

      expect(mockGenerateAccessToken).toHaveBeenCalledWith({
        userId: "user-123",
        email: "aditya@example.com",
      });
    });

    it("rejects requests without a refresh token", async () => {
      const response = await request(app).post("/auth/refresh");

      expect(response.status).toBe(401);

      expect(response.body).toEqual({
        success: false,
        message: "Refresh token missing",
      });

      expect(mockVerifyRefreshToken).not.toHaveBeenCalled();
    });

    it("rejects an invalid refresh token", async () => {
      mockVerifyRefreshToken.mockImplementation(() => {
        throw new Error("Invalid token");
      });

      const response = await request(app)
        .post("/auth/refresh")
        .set("Cookie", "refreshToken=invalid-refresh-token");

      expect(response.status).toBe(500);

      expect(response.body).toEqual({
        success: false,
        message: "Invalid token",
      });

      expect(mockGenerateAccessToken).not.toHaveBeenCalled();
    });
  });

  describe("POST /auth/logout", () => {
    it("clears the refresh token and logs the user out", async () => {
      const response = await request(app)
        .post("/auth/logout")
        .set("Cookie", "refreshToken=refresh-token");

      expect(response.status).toBe(200);

      expect(response.body).toEqual({
        success: true,
        message: "Logged out successfully.",
      });

      expect(response.headers["set-cookie"]).toEqual(
        expect.arrayContaining([expect.stringContaining("refreshToken=;")]),
      );
    });
  });
});

/*
Test coverage:

1. Register success
   → Verifies the HTTP endpoint accepts the request, calls the
     registration service, and returns HTTP 201 with the user.

2. Register failure
   → Verifies service errors are converted into an HTTP error response.

3. Login success
   → Verifies the endpoint returns the access token and sets the
     refresh token as a cookie.

4. Login failure
   → Verifies invalid credentials produce an error response.

5. Authenticated /me request
   → Verifies an authenticated user can access the endpoint and
     the user's data is returned.

6. Refresh success
   → Verifies a valid refresh cookie produces a new access token.

7. Refresh without a cookie
   → Verifies the endpoint returns 401 when the refresh token is missing.

8. Refresh with an invalid token
   → Verifies an invalid refresh token does not generate a new
     access token and returns an error response.

9. Logout
   → Verifies the refresh token cookie is cleared and the endpoint
     returns the expected success response.
*/
