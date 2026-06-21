import { Express } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
      };
    }
  }
}

//By default, Express's Request type doesn't know you have an authentication middleware injecting a user object into the request lifecycle.
