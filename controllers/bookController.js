const Book = require('../models/book');

const addBook = async (req, res) => {
  try {
    // Check if the user has the 'staff' role
    if (req.user.role !== 'staff') {
      return res.status(403).json({ message: 'Unauthorized: Only staff members can add books' });
    }

    const { title, author } = req.body;

    const book = new Book({
      title,
      author,
    });

    await book.save();

    res.status(201).json({ message: 'Book added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding book', error });
  }
};

const getBooks = async (req, res) => {
    try {
      const books = await Book.find();
      res.status(200).json(books);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching books', error });
    }
  };
  
  module.exports = { addBook, getBooks };