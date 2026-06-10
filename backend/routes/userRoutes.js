const express = require("express");
const router = express.Router();

const {
  getMe,
  updateMe,
  getMyRentedBooksCount,
} = require("../controllers/userController");

const protect = require("../middleware/authMiddleware");

router.get("/me", protect, getMe);
router.put("/me", protect, updateMe);
router.get("/me/rented-count", protect, getMyRentedBooksCount);

module.exports = router;