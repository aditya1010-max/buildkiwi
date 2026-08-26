import type { TokenPayload } from "../utils/jwt";

declare module "express-serve-static-core" {
  interface Request {
    user?: TokenPayload;
    visitorId?: string;
  }
}

export {};
//By default, Express's Request type doesn't know you have an authentication middleware injecting a user object into the request lifecycle.
