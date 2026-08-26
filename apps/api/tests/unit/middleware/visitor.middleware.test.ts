import { describe, expect, it, jest } from "@jest/globals";
import type { NextFunction, Request, Response } from "express";

import { visitorMiddleware } from "../../../src/middleware/visitor.middleware";

type VisitorRequest = Request & {
  visitorId?: string;
};

describe("visitorMiddleware", () => {
  it("rejects requests without a visitor ID", () => {
    const req = {
      header: jest.fn().mockReturnValue(undefined),
    } as unknown as VisitorRequest;

    const json = jest.fn();

    const res = {
      status: jest.fn().mockReturnValue({ json }),
    } as unknown as Response;

    const next = jest.fn() as NextFunction;

    visitorMiddleware(req, res, next);

    expect(req.header).toHaveBeenCalledWith("X-Visitor-Id");
    expect(res.status).toHaveBeenCalledWith(400);

    expect(json).toHaveBeenCalledWith({
      success: false,
      message: "Visitor ID is required.",
    });

    expect(next).not.toHaveBeenCalled();
  });

  it("stores the visitor ID and continues the request", () => {
    const req = {
      header: jest.fn().mockReturnValue("visitor-123"),
    } as unknown as VisitorRequest;

    const res = {} as Response;
    const next = jest.fn() as NextFunction;

    visitorMiddleware(req, res, next);

    expect(req.header).toHaveBeenCalledWith("X-Visitor-Id");
    expect(req.visitorId).toBe("visitor-123");
    expect(next).toHaveBeenCalled();
  });
});
