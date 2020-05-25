import express, { Router, Request, Response } from 'express';
import { Book } from '../models/Book';
import { books } from '../fake-database';
import { authReadOnlyMiddleware } from '../middleware/authMiddleware';

export const bookRouter : Router = express.Router();

bookRouter.use(authReadOnlyMiddleware);

bookRouter.get('/', (req:Request, res:Response) => {
  res.json(getAllBooks()); // call our function because we're separating concerns
});

bookRouter.post('/', (req:Request, res:Response) => {
  // Lets at least validate by checking for the existence of fields
  // We'll use a tool called Object destructuring:
  // This sets id, title, author, yearPublished, and wordCount
  let {id, title, author, yearPublished, wordCount} = req.body;
  // validate we received required fields:
  if(id && title && author && yearPublished) {
    addNewBook(new Book(id, title, author, yearPublished, wordCount));
    //If an error gets thrown, res.sendStatus(201) won't run.
    res.sendStatus(201);
  } else {
    // set response status to 400 and send appropriate message:
    res.status(400).send('Please include required fields.')
  }
});

//We're going to use a path parameter to get by id.  The syntax
// for parameter in the path is :param
// this will match books/1, books/2, books/50, ... (also books/notanum)
bookRouter.get('/:id', (req: Request, res: Response) => {
  // We access path paramers with req.params.param
  const id = +req.params.id; //The '+' converts our param to a number
  if(isNaN(id)) {
    res.status(400).send('Must include numeric id in path');
  } else {
    res.json(getBookById(id));
  }
});

function getBookById(id: number): Book {
  // Filter book array by id, then return the first/only book left
  return books.filter((book) => {
    return book.id === id;
  })[0];
}

function getAllBooks(): Book[] {
  return books;
}

// Responsible for putting completed Book objects in DB, not for constructing books
// Returns the book that was added
function addNewBook(book: Book): Book {
  // We should validate that the id is not already taken
  const booksMatchingId : Book[] = books.filter(
    (bookElement: Book) => {
      return bookElement.id === book.id;
    }
  );
  if (booksMatchingId.length === 0) {
    books.push(book);
    return book;
  } else {
    throw new Error('Book Id already taken');
  }
}