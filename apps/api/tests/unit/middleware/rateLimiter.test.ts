import { describe, expect, it } from "@jest/globals";

import { apiLimiter } from "../../../src/middleware/rateLimiter";

describe("apiLimiter", () => {
  it("is configured as an Express middleware", () => {
    expect(typeof apiLimiter).toBe("function");
  });
});

/*
Test coverage:

1. Is configured as an Express middleware
   → Verifies the exported rate limiter can be registered as Express
     middleware.

The actual rate-limit threshold and 429 response should be covered by
an HTTP test because those behaviors belong to the integration between
our configuration, Express, and express-rate-limit.
*/
