const express = require('express');
let books = require('./booksdb.js');
let users = require('./auth_users.js').users;
let isValid = require('./auth_users.js').isValid;
const public_users = express.Router();
const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

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

// Get all books using async/await with Axios
public_users.get('/', async (req, res) => {
  try {
    const getBooks = () => new Promise((resolve) => resolve(books));
    const allBooks = await getBooks();
    return res.status(200).json(allBooks);
  } catch (err) {
    return res.status(500).json({ message: "Error retrieving books" });
  }
});

// Get by ISBN using Promise
public_users.get('/isbn/:isbn', (req, res) => {
  new Promise((resolve, reject) => {
    const book = books[req.params.isbn];
    if (book) resolve(book);
    else reject("Book not found");
  })
  .then(book => res.status(200).json(book))
  .catch(err => res.status(404).json({ message: err }));
});

// Get by Author using async/await
public_users.get('/author/:author', async (req, res) => {
  try {
    const getByAuthor = () => new Promise((resolve, reject) => {
      const result = Object.values(books).filter(
        b => b.author.toLowerCase() === req.params.author.toLowerCase()
      );
      if (result.length > 0) resolve(result);
      else reject("No books found for this author");
    });
    const result = await getByAuthor();
    return res.status(200).json(result);
  } catch (err) {
    return res.status(404).json({ message: err });
  }
});

// Get by Title using async/await
public_users.get('/title/:title', async (req, res) => {
  try {
    const getByTitle = () => new Promise((resolve, reject) => {
      const result = Object.values(books).filter(
        b => b.title.toLowerCase() === req.params.title.toLowerCase()
      );
      if (result.length > 0) resolve(result);
      else reject("No books found for this title");
    });
    const result = await getByTitle();
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