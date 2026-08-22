import { describe, expect, it } from "@jest/globals";

import { upload } from "../../../src/middleware/upload.middleware";

describe("upload middleware", () => {
  it("exports a valid Multer instance", () => {
    expect(upload).toBeDefined();
    expect(typeof upload).toBe("object");
    expect(typeof upload.single).toBe("function");
  });

  it("provides single-file upload middleware", () => {
    const middleware = upload.single("coverImage");

    expect(typeof middleware).toBe("function");
  });
});
/*
Test coverage:

1. Exports a valid Multer instance
   → Verifies the upload configuration creates a Multer instance
     and exposes the expected `single` middleware method.

2. Provides single-file upload middleware
   → Verifies `upload.single("coverImage")` produces a valid
     Express middleware function.

The actual file filtering, memory storage, and 512 KB size limit should
be verified at the HTTP/integration layer because those behaviors depend
on Multer processing an actual multipart/form-data request.
*/
