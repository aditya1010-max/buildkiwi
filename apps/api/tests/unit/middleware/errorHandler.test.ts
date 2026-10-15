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
      headersSent: false,
    } as unknown as Response;

    const req = {} as Request;
    const next = jest.fn() as NextFunction;

    errorHandler(error, req, res, next);

    expect(status).toHaveBeenCalledWith(404);

    expect(json).toHaveBeenCalledWith({
      success: false,
      message: "Project not found",
    });

    expect(next).not.toHaveBeenCalled();
  });

  it("returns a generic 500 response for a regular error", () => {
    const error = new Error("Something went wrong");

    const json = jest.fn();
    const status = jest.fn().mockReturnValue({ json });

    const res = {
      status,
      headersSent: false,
    } as unknown as Response;

    const req = {} as Request;
    const next = jest.fn() as NextFunction;

    errorHandler(error, req, res, next);

    expect(status).toHaveBeenCalledWith(500);

    expect(json).toHaveBeenCalledWith({
      success: false,
      message: "Internal Server Error",
    });

    expect(next).not.toHaveBeenCalled();
  });

  it("uses the fallback message when an error has no message", () => {
    const error = new Error();

    const json = jest.fn();
    const status = jest.fn().mockReturnValue({ json });

    const res = {
      status,
      headersSent: false,
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

  it("passes the error to next when headers have already been sent", () => {
    const error = new Error("Something went wrong");

    const status = jest.fn();
    const json = jest.fn();

    const res = {
      status,
      headersSent: true,
    } as unknown as Response;

    const req = {} as Request;
    const next = jest.fn() as NextFunction;

    errorHandler(error, req, res, next);

    expect(next).toHaveBeenCalledWith(error);
    expect(status).not.toHaveBeenCalled();
    expect(json).not.toHaveBeenCalled();
  });
});
