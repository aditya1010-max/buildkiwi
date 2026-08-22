import { beforeEach, describe, expect, it, jest } from "@jest/globals";

import { verifyAccessToken } from "../../../src/utils/jwt";
import { authMiddleware } from "../../../src/middleware/auth.middleware";

jest.mock("../../../src/utils/jwt", () => ({
  verifyAccessToken: jest.fn(),
}));

const mockVerifyAccessToken = jest.mocked(verifyAccessToken);

describe("authMiddleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("rejects requests without an authorization header", () => {
    const req = {
      headers: {},
    } as any;

    const json = jest.fn();
    const status = jest.fn().mockReturnValue({ json });

    const res = {
      status,
    } as any;

    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(status).toHaveBeenCalledWith(401);

    expect(json).toHaveBeenCalledWith({
      success: false,
      message: "Unauthorized",
    });

    expect(next).not.toHaveBeenCalled();
  });

  it("rejects requests without a Bearer token", () => {
    const req = {
      headers: {
        authorization: "Basic token",
      },
    } as any;

    const json = jest.fn();
    const status = jest.fn().mockReturnValue({ json });

    const res = {
      status,
    } as any;

    const next = jest.fn();

    authMiddleware(req, res, next);

    expect(status).toHaveBeenCalledWith(401);

    expect(json).toHaveBeenCalledWith({
      success: false,
      message: "Unauthorized",
    });

    expect(next).not.toHaveBeenCalled();
  });

  it("attaches the decoded user and calls next for a valid token", () => {
    const decodedUser = {
      userId: "user-123",
      email: "user@example.com",
    };

    const req = {
      headers: {
        authorization: "Bearer valid-token",
      },
    } as any;

    const res = {} as any;
    const next = jest.fn();

    mockVerifyAccessToken.mockReturnValue(decodedUser);

    authMiddleware(req, res, next);

    expect(mockVerifyAccessToken).toHaveBeenCalledWith("valid-token");

    expect(req.user).toEqual(decodedUser);

    expect(next).toHaveBeenCalled();
  });

  it("rejects an invalid or expired token", () => {
    const req = {
      headers: {
        authorization: "Bearer invalid-token",
      },
    } as any;

    const json = jest.fn();
    const status = jest.fn().mockReturnValue({ json });

    const res = {
      status,
    } as any;

    const next = jest.fn();

    mockVerifyAccessToken.mockImplementation(() => {
      throw new Error("Invalid token");
    });

    authMiddleware(req, res, next);

    expect(status).toHaveBeenCalledWith(401);

    expect(json).toHaveBeenCalledWith({
      success: false,
      message: "Invalid or expired access token",
    });

    expect(next).not.toHaveBeenCalled();
  });
});

/*
Test coverage:

1. Rejects requests without an authorization header
   → Verifies requests without authentication receive a 401 response.

2. Rejects requests without a Bearer token
   → Verifies authentication headers using an unsupported scheme are
     rejected before token verification.

3. Attaches the decoded user and calls next for a valid token
   → Verifies a valid access token is verified, the decoded user is
     attached to req.user, and the request continues.

4. Rejects an invalid or expired token
   → Verifies token verification failures return a 401 response and
     prevent the request from continuing.
*/
