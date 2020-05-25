import session from 'express-session';

//express session provides session-handling middleware
// this third-party middleware can/should be configured, so we'll
// pull it out into this file.

const sessionConfig = {
  secret: 'thisShouldBeSecret',
  cookie: {secure:false},
  resave: false,
  saveUninitialized: false
}

//Once we have our config, we pass it into a function that produces
// the middleware we're going to use.  This type of function is called
// a "factory function".  Factory function/method is something called a
// "design pattern", a language agnostic solution to a common problem.
export const sessionMiddleware = session(sessionConfig);
//Keep in mind sessionMiddleware is middleware, so it's a function that takes
// ( req, res, next ) and eventually calls next().