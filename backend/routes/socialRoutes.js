const express = require("express");
const router = express.Router();

const {
  toggleLikeBook,
  getLikeCount,
  addComment,
  getComments,
} = require("../controllers/socialController");

const protect = require("../middleware/authMiddleware");

// Likes
router.post("/like/:bookId", protect, toggleLikeBook);
router.get("/like/:bookId", getLikeCount);

// Comments
router.post("/comment/:bookId", protect, addComment);
router.get("/comment/:bookId", getComments);

module.exports = router;