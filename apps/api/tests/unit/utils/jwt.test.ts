import { describe, expect, it } from "@jest/globals";

import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "../../../src/utils/jwt";

const payload = {
  userId: "user-123",
  email: "user@example.com",
};

describe("JWT utilities", () => {
  it("generates and verifies an access token", () => {
    const token = generateAccessToken(payload);

    const decoded = verifyAccessToken(token);

    expect(decoded.userId).toBe(payload.userId);
    expect(decoded.email).toBe(payload.email);
  });

  it("generates and verifies a refresh token", () => {
    const token = generateRefreshToken(payload);

    const decoded = verifyRefreshToken(token);

    expect(decoded.userId).toBe(payload.userId);
    expect(decoded.email).toBe(payload.email);
  });

  it("does not allow an access token to be verified as a refresh token", () => {
    const accessToken = generateAccessToken(payload);

    expect(() => verifyRefreshToken(accessToken)).toThrow();
  });

  it("rejects a tampered token", () => {
    const token = generateAccessToken(payload);
    const tamperedToken = `${token}tampered`;

    expect(() => verifyAccessToken(tamperedToken)).toThrow();
  });
});

/*
Test coverage:

1. Generates and verifies an access token
   → Verifies that an access token can be created with the expected
     payload and successfully verified using the access-token secret.

2. Generates and verifies a refresh token
   → Verifies that a refresh token can be created with the expected
     payload and successfully verified using the refresh-token secret.

3. Does not allow an access token to be verified as a refresh token
   → Verifies that access and refresh tokens use separate signing secrets
     and cannot be used interchangeably.

4. Rejects a tampered token
   → Verifies that modifying a signed token causes verification to fail.
*/
