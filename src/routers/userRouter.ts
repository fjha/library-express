import express, { Router, Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { authAdminMiddleware, authRoleFactory } from '../middleware/authMiddleware';
import { getAllUsers, addNewUser, getUserById } from '../repository/user-data-access';

export const userRouter: Router = express.Router();

//Apply our Admin Middleware on userRouter
userRouter.use(authRoleFactory(['Admin']));

// have an async callback to work with our asynchronous data access
userRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
  // get all users, using async/await
  const users : User[] = await getAllUsers();
  res.json(users);
  } catch (e) {
    next(e);
  }
});

userRouter.post('/', async (req: Request, res: Response) => {
  let {id, username, password, email, role} = req.body;
  if(id && username && password && email && role) {
    await addNewUser(new User(id, username, password, email, role));
    res.sendStatus(201);
  } else {
    res.status(400).send('Please include required fields.');
  }
});

userRouter.get('/:id', (req: Request, res: Response) => {
  const id = +req.params.id;
  if(isNaN(id)) {
    res.status(400).send('Must include numeric id in path');
  } else {
    res.json(getUserById(id));
  }
});