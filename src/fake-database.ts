import { Book } from "./models/Book";
import { User } from "./models/User";

// Just a stand in for the DB.

export const books : Book[] = [
  new Book(1, 'The Two Towers', 'J.R.R. Tolkien', 1954),
  new Book(2, 'The Cat in the Hat', 'Dr. Seuss', 1955)
];

export const users : User[] = [
  new User(1, 'aking', 'wasspord', 'adam.king@revature.com', 'Admin'),
  new User(2, 'bworrell', '345543', 'benjamin.w@gmail.com', 'Admin')
];