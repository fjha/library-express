import express, {Request, Response, NextFunction} from 'express';

// Right now, we just have 'Admin' role.  Let's make sure the logged in user
// is an 'Admin' before responding at any /users endpoints

export const authAdminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // if no session or no user on that session
  if(!req.session || !req.session.user) {
    res.status(401).send('Please login');
  } else if (req.session.user.role !== 'Admin') {
    res.status(403).send('You are not authorized');
  } else {
    next();
  }
}

//We can write our own factory method for producing role-based auth middleware:
// We want a function that takes an array of permitted roles and returns middleware
// that authorizes based on those roles.
export function authRoleFactory(roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if(!req.session || !req.session.user) {
      res.status(401).send('Please login');
    } else {
      let allowed = false;
      for(let role of roles) {
        if(req.session.user.role === role) {
          allowed = true;
        }
      }
      if(allowed) {
        next();
      } else {
        res.status(403).send(`Not authorized with role: ${req.session.user.role}`);
      }
    }
  }
}

// Our factory can produce our admin role middleware.

// let GET requests in from anyone, let POST/other requests in if the user is logged in
export const authReadOnlyMiddleware = (req: Request, res: Response, next: NextFunction) => {
  if(req.method === 'GET') {
    next();
  } else if(!req.session || !req.session.user) {
    res.status(401).send(`Cannot ${req.method} unless you first login`);
  } else {
    next();
  }
}