// Thus far, we've only used prebuilt middleware (bodyParser.json()) and set up endpoints
// We can write our own middleware that processes requests/responses, but we need to learn
// about next().  The callbacks that we give to express need to either call a method on res, which
// sends a response, or they need to call next().  Calling next() calls the next middleware/endpoint
// and is how we split our request processing up across multiple functions.

import { Request, Response, NextFunction } from "express";

// We'll start by writing custom logging middleware
export function loggingMiddleware(req: Request, res: Response, next: NextFunction) {
  // all of the callbacks we write with either app.use or app.get, etc. need to
  // call next() or call a method on res.  In middleware, we call next.
  console.log(`Request received to url: ${req.url} with method: ${req.method}`);
  next();
}

