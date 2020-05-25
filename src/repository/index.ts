// You may encounter this pattern, where each folder in a project has its own index.ts file
// The index is the entrypoint for that folder, and the top level index is the entrypoint for the project.
// We're using this pattern because repository/index.ts is necessary for all of our data access logic to work.
import { Pool } from 'pg';

// The "Pool" above is a "Connection Pool" that represents mutliple connections to our database.
// Connection pools are almost always used in place of single connections.
// The Pool is a "Factory" for connections, and we can retrieve a connection from the pool
// whenever we need to query the database.  We'll need to put our connections back in the pool
// when we're done using them so they can be reused.

// Here we're specifying how to connect to our database.  We'll need the same credentials we used
// when connecting via DBeaver.  It's a good practice to retrieve those credentials from environment
// variables rather than type them directly in the code.  This means we'll need to run some Git BASH
// commands to store our credentials, then we'll use process.env to retrieve them.

// We can store/retrieve any value we want with a name and a value:
// in Git BASH: export NAME=value
// in node: process.env['NAME'] will return value

// We're set up to retrieve values from the environment that have names:
// PG_HOST, PG_USER, PG_PASSWORD, PG_DATABASE
// We just need to set them in Git BASH
// For MY credentials:
// export PG_HOST=database-ems.chkovyfhlhvp.us-east-2.rds.amazonaws.com
// export PG_USER=postgres
// export PG_PASSWORD=wasspord
// export PG_DATABASE=postgres
//database-2.chkovyfhlhvp.us-east-2.rds.amazonaws.com
export const connectionPool : Pool = new Pool({
  host: process.env['PG_HOST'],
  user: process.env['PG_USER'],
  password: process.env['PG_PASSWORD'],
  database: process.env['PG_DATABASE'],
  port: 5432,
  max: 5 //max number of connections
});


