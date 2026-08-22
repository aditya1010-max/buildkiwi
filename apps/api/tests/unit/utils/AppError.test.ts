import { describe, expect, it } from "@jest/globals";

import { AppError } from "../../../src/utils/AppError";

describe("AppError", () => {
  it("creates an error with the provided message and status code", () => {
    const error = new AppError("Project not found", 404);

    expect(error.message).toBe("Project not found");
    expect(error.statusCode).toBe(404);
  });

  it("is an instance of Error", () => {
    const error = new AppError("Unauthorized", 401);

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(AppError);
  });

  it("captures a stack trace", () => {
    const error = new AppError("Something went wrong", 500);

    expect(error.stack).toBeDefined();
  });
});

/*
Test coverage:

1. Creates an error with the provided message and status code
   → Verifies AppError preserves the message and HTTP status code passed
     to its constructor.

2. Is an instance of Error
   → Verifies AppError correctly extends the native Error class and can
     be handled anywhere a normal Error is expected.

3. Captures a stack trace
   → Verifies AppError retains debugging information through its
     Error.captureStackTrace() setup.
*/
