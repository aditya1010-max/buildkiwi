import { describe, expect, it, jest } from "@jest/globals";
import type { NextFunction, Request, Response } from "express";

import { errorHandler } from "../../../src/middleware/errorHandler";
import { AppError } from "../../../src/utils/AppError";

describe("errorHandler", () => {
  it("returns the status code and message from an AppError", () => {
    const error = new AppError("Project not found", 404);

    const json = jest.fn();
    const status = jest.fn().mockReturnValue({ json });

    const res = {
      status,
    } as unknown as Response;

    const req = {} as Request;
    const next = jest.fn() as NextFunction;

    errorHandler(error, req, res, next);

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
    } as unknown as Response;

    const req = {} as Request;
    const next = jest.fn() as NextFunction;

    errorHandler(error, req, res, next);

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
    } as unknown as Response;

    const req = {} as Request;
    const next = jest.fn() as NextFunction;

    errorHandler(error, req, res, next);

    expect(status).toHaveBeenCalledWith(500);

    expect(json).toHaveBeenCalledWith({
      success: false,
      message: "Internal Server Error",
    });
  });
});
