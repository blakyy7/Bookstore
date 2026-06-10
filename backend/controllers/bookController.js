const Book = require("../models/Book");

const getBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createBook = async (req, res) => {
  try {
    const { uniqueId, title, author, publicationYear, genre, isbn, availabilityStatus } = req.body;

    if (!uniqueId || !title || !author || !publicationYear || !genre || !isbn) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingBook = await Book.findOne({
      $or: [{ uniqueId }, { isbn }],
    });

    if (existingBook) {
      return res.status(400).json({ message: "Book already exists" });
    }

    const book = await Book.create({
      uniqueId,
      title,
      author,
      publicationYear,
      genre,
      isbn,
      availabilityStatus: availabilityStatus !== undefined ? availabilityStatus : true,
      addedBy: req.user._id,
    });

    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    await Book.findByIdAndDelete(req.params.id);

    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const toggleLikeBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    const userId = req.user._id.toString();
    const alreadyLiked = book.likes.some((id) => id.toString() === userId);

    if (alreadyLiked) {
      book.likes = book.likes.filter((id) => id.toString() !== userId);
    } else {
      book.likes.push(req.user._id);
    }

    await book.save();

    res.json({
      message: alreadyLiked ? "Book unliked" : "Book liked",
      likesCount: book.likes.length,
      book,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
  toggleLikeBook,
};