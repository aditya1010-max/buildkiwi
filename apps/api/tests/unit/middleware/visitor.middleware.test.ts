import { describe, expect, it, jest } from "@jest/globals";

import { visitorMiddleware } from "../../../src/middleware/visitor.middleware";

describe("visitorMiddleware", () => {
  it("rejects requests without a visitor ID", () => {
    const req = {
      header: jest.fn().mockReturnValue(undefined),
    } as any;

    const json = jest.fn();

    const res = {
      status: jest.fn().mockReturnValue({ json }),
    } as any;

    const next = jest.fn();

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
    } as any;

    const res = {} as any;
    const next = jest.fn();

    visitorMiddleware(req, res, next);

    expect(req.header).toHaveBeenCalledWith("X-Visitor-Id");
    expect(req.visitorId).toBe("visitor-123");
    expect(next).toHaveBeenCalled();
  });
});

/*
Test coverage:

1. Rejects requests without a visitor ID
   → Verifies requests without the X-Visitor-Id header receive a 400
     response and are not passed to the next middleware.

2. Stores the visitor ID and continues the request
   → Verifies the visitor ID is attached to req.visitorId and that the
     request continues through the middleware chain.
*/
