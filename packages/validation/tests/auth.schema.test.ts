import { describe, expect, it } from "vitest";

import { LoginSchema, RegisterSchema } from "../src/auth.schema";

describe("RegisterSchema", () => {
  it("accepts valid registration data", () => {
    const input = {
      username: "aditya",
      email: "aditya@example.com",
      password: "password123",
    };

    const result = RegisterSchema.safeParse(input);

    expect(result.success).toBe(true);
  });

  it("rejects a username shorter than 3 characters", () => {
    const input = {
      username: "ad",
      email: "aditya@example.com",
      password: "password123",
    };

    const result = RegisterSchema.safeParse(input);

    expect(result.success).toBe(false);
  });

  it("rejects an invalid email", () => {
    const input = {
      username: "aditya",
      email: "not-an-email",
      password: "password123",
    };

    const result = RegisterSchema.safeParse(input);

    expect(result.success).toBe(false);
  });

  it("rejects a password shorter than 8 characters", () => {
    const input = {
      username: "aditya",
      email: "aditya@example.com",
      password: "pass123",
    };

    const result = RegisterSchema.safeParse(input);

    expect(result.success).toBe(false);
  });

  it("rejects registration data when a required field is missing", () => {
    const input = {
      username: "aditya",
      email: "aditya@example.com",
    };

    const result = RegisterSchema.safeParse(input);

    expect(result.success).toBe(false);
  });
});

describe("LoginSchema", () => {
  it("accepts valid login data", () => {
    const input = {
      email: "aditya@example.com",
      password: "password123",
    };

    const result = LoginSchema.safeParse(input);

    expect(result.success).toBe(true);
  });

  it("rejects an invalid email", () => {
    const input = {
      email: "not-an-email",
      password: "password123",
    };

    const result = LoginSchema.safeParse(input);

    expect(result.success).toBe(false);
  });

  it("rejects login data when email is missing", () => {
    const input = {
      password: "password123",
    };

    const result = LoginSchema.safeParse(input);

    expect(result.success).toBe(false);
  });

  it("rejects login data when password is missing", () => {
    const input = {
      email: "aditya@example.com",
    };

    const result = LoginSchema.safeParse(input);

    expect(result.success).toBe(false);
  });
});

/*
Test coverage:

RegisterSchema
1. Valid registration data
   → Ensures a correctly structured registration request is accepted.

2. Username shorter than 3 characters
   → Verifies the username minimum length rule.

3. Invalid email
   → Verifies that the email must be a valid email address.

4. Password shorter than 8 characters
   → Verifies the password minimum length rule.

5. Missing required field
   → Verifies that required registration fields cannot be omitted.

LoginSchema
6. Valid login data
   → Ensures a correctly structured login request is accepted.

7. Invalid email
   → Verifies that login requires a valid email address.

8. Missing email
   → Verifies that email is required for login.

9. Missing password
   → Verifies that password is required for login.
*/