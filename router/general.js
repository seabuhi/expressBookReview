const express = require('express');
let books = require('./booksdb.js');
let isValid = require('./auth_users.js').isValid;
let users = require('./auth_users.js').users;
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }
  if (isValid(username)) {
    return res.status(400).json({ message: "User already exists" });
  }
  users.push({ username, password });
  return res.status(200).json({ message: "User registered successfully" });
});

// Get all books
public_users.get('/', async (req, res) => {
  try {
    const getBooks = () => {
      return new Promise((resolve) => resolve(books));
    };
    const allBooks = await getBooks();
    return res.status(200).json(allBooks);
  } catch (err) {
    return res.status(500).json({ message: "Error retrieving books" });
  }
});

// Get by ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
  try {
    const getByISBN = (isbn) => {
      return new Promise((resolve, reject) => {
        const book = books[isbn];
        if (book) resolve(book);
        else reject("Book not found");
      });
    };
    const book = await getByISBN(req.params.isbn);
    return res.status(200).json(book);
  } catch (err) {
    return res.status(404).json({ message: err });
  }
});

// Get by Author
public_users.get('/author/:author', async (req, res) => {
  try {
    const getByAuthor = (author) => {
      return new Promise((resolve, reject) => {
        const result = Object.values(books).filter(
          b => b.author.toLowerCase() === author.toLowerCase()
        );
        if (result.length > 0) resolve(result);
        else reject("No books found");
      });
    };
    const result = await getByAuthor(req.params.author);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(404).json({ message: err });
  }
});

// Get by Title
public_users.get('/title/:title', async (req, res) => {
  try {
    const getByTitle = (title) => {
      return new Promise((resolve, reject) => {
        const result = Object.values(books).filter(
          b => b.title.toLowerCase() === title.toLowerCase()
        );
        if (result.length > 0) resolve(result);
        else reject("No books found");
      });
    };
    const result = await getByTitle(req.params.title);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(404).json({ message: err });
  }
});

// Get reviews
public_users.get('/review/:isbn', (req, res) => {
  const book = books[req.params.isbn];
  if (!book) return res.status(404).json({ message: "Book not found" });
  return res.status(200).json(book.reviews);
});

module.exports.general = public_users;