import express from "express";
import { Application, Request, Response, NextFunction } from "express";
import bodyParser from 'body-parser';
import { User } from "./models/User";
import { loggingMiddleware } from "./middleware/loggingMiddleware";
import { bookRouter } from "./routers/bookRouter";
import { userRouter} from "./routers/userRouter";
import { sessionMiddleware } from "./middleware/sessionMiddleware";
import { findUserByUsernamePassword } from "./repository/user-data-access";
import { PoolClient, QueryResult } from "pg";
import { connectionPool } from "./repository";



const app: Application = express();

// We'll start setting up get and post endpoints for books and for users.
// We'll want a getAll endpoint at the "root" for each route (/books or /users)
// We'll want a POST endpoint at the "root" for each route to add new books or users
// We'll want a getById endpoint at /books/1 for book 1, /books/2 for book 2, ...
//   and similar for users

// We're going to separate our concerns and write functions that getAll, getById, and addNew
// for books and users, then tie those functions to endpoints

// app.get('/hello', (req : Request, res : Response) => {
//   res.json('Hello');
// });

// this applies to all endpoints
app.use(bodyParser.json());

// add session middleware:
app.use(sessionMiddleware);
// After this point, each req has a session associated with a user.
// repeat requests from the same user share their session.

// this applies to all endpoints, second callback in the chain
app.use(loggingMiddleware);

// Let's do the views demo:
app.get('/views', (req: Request, res: Response) => {
  console.log(req.session); // try to log it
  if(req.session && req.session.views) {
    req.session.views++;
    res.send(`Reached this endpoint ${req.session.views} times`);
  } else if(req.session) {
    req.session.views = 1;
    res.send('Reached the views endpoint for the first time');
  } else {
    res.send('Reached the views endpoint without a session')
  }
});

// Let's do some basic "auth", meaning authentication (identifying users) and
// authorization (providing permission is access)

// "Authentication" endpoint -- lets the user login
app.post('/login', async (req: Request, res: Response) => {
  // We're assuming users login with username and password inside a JSON object
  // get that data:
  const {username, password} = req.body;
  if( !username || !password) {
    res.status(400).send('Please include username and password fields for login');
  } else {
    try {
      const user = await findUserByUsernamePassword(username, password);
      if(req.session) {
        req.session.user = user;
      }
      //send the user back, as a favor to our future selves
      res.json(user);
    } catch (e) {
      console.log(e.message);
      res.status(401).send('Failed to authenticate username and password');
    }
  }
});

// // modifies all requests to GET requests
// app.use((req: Request, res: Response, next: NextFunction) => {
//   req.method = 'GET'; //experiment
//   next();
// });

// app.use((req: Request, res: Response, next: NextFunction) => {
//   res.send('short circuit all our endpoints');
// })

// We can define endpoints across multiple files using a router.
// a router is like 'app' except it just contains some endpoints, not the
// entire application.
// We can apply middleware to one router but not another, if we choose.

// Use a router like we use middleware or make endpoints:
app.use('/books', bookRouter);

app.use('/users', userRouter);



app.listen(1999, () => {

  // The following involves 3 different async steps.  Right now we're in a callback
  // function that runs asynchronously when the express application starts.
  // In this callback, we connect to the database, which is asynchronous, so we specify
  // a callback for that.  In that callback, we query the database, which is asynchronous,
  // so we specify a callback for it too.
  // One of the reasons async/await was added to JS was to avoid "callback hell"

  console.log("app has started, testing connection:");
  // connectionPool.connect() returns a Promise of a PoolClient
  // we specify functionality for when the PoolClient arrives via callbacks:
  // .then(onSuccess) specifies behaviour when the Promise resolves successfully
  // .catch(onFailure) specifies behaviour when the Promise is rejected (fails).
  connectionPool.connect().then(
    (client: PoolClient)=>{
      console.log('connected');
      // try to query tracks
      // client.query returns a Promise of a query result
      
      client.query('SELECT * FROM books;').then(
        (result : QueryResult) => {
          console.log(result.rows[3]);
        }
      )
  }).catch((err)=>{
    console.error(err.message);
  })
});



