const express = require("express");
const router = express.Router();

const {
  requestRental,
  getMyRentalRequests,
  getAllRentalRequests,
  updateRentalStatus,
} = require("../controllers/rentalController");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

router.post("/request/:bookId", protect, requestRental);

router.get("/my", protect, getMyRentalRequests);

router.get("/", protect, adminOnly, getAllRentalRequests);

router.put("/:id", protect, adminOnly, updateRentalStatus);

module.exports = router;