import { describe, expect, it, jest } from "@jest/globals";

import { errorHandler } from "../../../src/middleware/errorHandler";
import { AppError } from "../../../src/utils/AppError";

describe("errorHandler", () => {
  it("returns the status code and message from an AppError", () => {
    const error = new AppError("Project not found", 404);

    const json = jest.fn();
    const status = jest.fn().mockReturnValue({ json });

    const res = {
      status,
    } as any;

    errorHandler(error, {} as any, res, jest.fn());

    expect(status).toHaveBeenCalledWith(404);

    expect(json).toHaveBeenCalledWith({
      success: false,
      message: "Project not found",
    });
  });

  it("returns 500 for a regular error", () => {
    const error = new Error("Something went wrong");

    const json = jest.fn();
    const status = jest.fn().mockReturnValue({ json });

    const res = {
      status,
    } as any;

    errorHandler(error, {} as any, res, jest.fn());

    expect(status).toHaveBeenCalledWith(500);

    expect(json).toHaveBeenCalledWith({
      success: false,
      message: "Something went wrong",
    });
  });

  it("uses the fallback message when an error has no message", () => {
    const error = new Error();

    const json = jest.fn();
    const status = jest.fn().mockReturnValue({ json });

    const res = {
      status,
    } as any;

    errorHandler(error, {} as any, res, jest.fn());

    expect(status).toHaveBeenCalledWith(500);

    expect(json).toHaveBeenCalledWith({
      success: false,
      message: "Internal Server Error",
    });
  });
});

/*
Test coverage:

1. Handles an AppError
   → Verifies custom application errors use their own status code and
     message.

2. Handles a regular Error
   → Verifies unexpected errors return HTTP 500 while preserving the
     error message.

3. Uses the fallback error message
   → Verifies "Internal Server Error" is returned when the error does
     not contain a message.
*/
