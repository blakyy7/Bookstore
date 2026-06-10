const Like = require("../models/Like");
const Comment = require("../models/Comment");
const Book = require("../models/Book");

// Like / Unlike a book
const toggleLikeBook = async (req, res) => {
  try {
    const bookId = req.params.bookId;
    const userId = req.user._id;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    const existingLike = await Like.findOne({ user: userId, book: bookId });

    if (existingLike) {
      await Like.deleteOne({ _id: existingLike._id });
      return res.json({ message: "Book unliked" });
    }

    await Like.create({ user: userId, book: bookId });
    return res.json({ message: "Book liked" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Get like count for a book
const getLikeCount = async (req, res) => {
  try {
    const bookId = req.params.bookId;
    const count = await Like.countDocuments({ book: bookId });
    res.json({ likeCount: count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add comment to a book
const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    const bookId = req.params.bookId;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Comment cannot be empty" });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    const comment = await Comment.create({
      user: req.user._id,
      book: bookId,
      text: text.trim(),
    });

    const populatedComment = await Comment.findById(comment._id).populate(
      "user",
      "name email"
    );

    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all comments for a book
const getComments = async (req, res) => {
  try {
    const bookId = req.params.bookId;

    const comments = await Comment.find({ book: bookId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  toggleLikeBook,
  getLikeCount,
  addComment,
  getComments,
};