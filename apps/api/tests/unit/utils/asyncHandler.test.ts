import { describe, expect, it, jest } from "@jest/globals";
import type { NextFunction, Request, Response } from "express";

import { asyncHandler } from "../../../src/utils/asyncHandler";

describe("asyncHandler", () => {
  it("calls the wrapped handler", async () => {
    const handler = jest.fn(
      async (_req: Request, _res: Response, _next: NextFunction) => {},
    );

    const req = {} as Request;
    const res = {} as Response;
    const next = jest.fn() as NextFunction;

    const wrappedHandler = asyncHandler(handler);

    wrappedHandler(req, res, next);

    await Promise.resolve();

    expect(handler).toHaveBeenCalledWith(req, res, next);
  });

  it("passes rejected errors to next", async () => {
    const error = new Error("Something went wrong");

    const handler = jest.fn(
      async (_req: Request, _res: Response, _next: NextFunction) => {
        throw error;
      },
    );

    const req = {} as Request;
    const res = {} as Response;
    const next = jest.fn() as NextFunction;

    const wrappedHandler = asyncHandler(handler);

    wrappedHandler(req, res, next);

    await Promise.resolve();

    expect(next).toHaveBeenCalledWith(error);
  });
});

/*
Test coverage:

1. Calls the wrapped handler
   → Verifies asyncHandler forwards the Express request, response, and
     next function to the original async handler.

2. Passes rejected errors to next
   → Verifies errors rejected by the async handler are caught and passed
     to Express's next() function.
*/
