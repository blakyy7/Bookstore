const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  updateUserByAdmin,
  blockUser,
  unblockUser,
  getAllBooks,
  getAllRentals,
} = require("../controllers/adminController");

const adminOnly = require("../middleware/adminMiddleware");
const protect = require("../middleware/authMiddleware");

router.get("/users", protect, adminOnly, getAllUsers);
router.put("/users/:id", protect, adminOnly, updateUserByAdmin);
router.patch("/users/:id/block", protect, adminOnly, blockUser);
router.patch("/users/:id/unblock", protect, adminOnly, unblockUser);
router.get("/books", protect, adminOnly, getAllBooks);
router.get("/rentals", protect, adminOnly, getAllRentals);

module.exports = router;