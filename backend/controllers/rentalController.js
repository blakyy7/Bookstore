const RentalRequest = require("../models/RentalRequest");
const Book = require("../models/Book");
const User = require("../models/User");

const requestRental = async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (!book.availabilityStatus) {
      return res.status(400).json({ message: "Book is already rented" });
    }

    const existingRequest = await RentalRequest.findOne({
      user: req.user._id,
      book: req.params.bookId,
      status: { $in: ["pending", "approved"] },
    });

    if (existingRequest) {
      return res.status(400).json({
        message: "You already have an active request for this book",
      });
    }

    const rental = await RentalRequest.create({
      user: req.user._id,
      book: req.params.bookId,
      status: "pending",
    });

    res.status(201).json(rental);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyRentalRequests = async (req, res) => {
  try {
    const requests = await RentalRequest.find({ user: req.user._id })
      .populate("book")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllRentalRequests = async (req, res) => {
  try {
    const requests = await RentalRequest.find()
      .populate("user", "name email phoneNumber")
      .populate("book")
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateRentalStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["approved", "rejected", "returned"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const rental = await RentalRequest.findById(req.params.id)
      .populate("user")
      .populate("book");

    if (!rental) {
      return res.status(404).json({ message: "Rental request not found" });
    }

    rental.status = status;

    if (status === "approved") {
      rental.book.availabilityStatus = false;
      await rental.book.save();

      const user = await User.findById(rental.user._id);
      user.rentedBooksCount += 1;
      await user.save();

      rental.dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    }

    if (status === "returned") {
      rental.book.availabilityStatus = true;
      await rental.book.save();
    }

    await rental.save();

    const updatedRental = await RentalRequest.findById(rental._id)
      .populate("user", "name email phoneNumber")
      .populate("book");

    res.json(updatedRental);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  requestRental,
  getMyRentalRequests,
  getAllRentalRequests,
  updateRentalStatus,
};