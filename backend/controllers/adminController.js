const User = require("../models/User");
const Book = require("../models/Book");
const RentalRequest = require("../models/RentalRequest");
const bcrypt = require("bcryptjs");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateUserByAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const {
      name,
      place,
      age,
      email,
      education,
      contactDetails,
      phoneNumber,
      password,
      role,
      isBlocked,
      termsAccepted,
    } = req.body;

    if (name !== undefined) user.name = name;
    if (place !== undefined) user.place = place;
    if (age !== undefined) user.age = age;
    if (email !== undefined) user.email = email;
    if (education !== undefined) user.education = education;
    if (contactDetails !== undefined) user.contactDetails = contactDetails;
    if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
    if (role !== undefined) user.role = role;
    if (isBlocked !== undefined) user.isBlocked = isBlocked;
    if (termsAccepted !== undefined) user.termsAccepted = termsAccepted;

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      place: updatedUser.place,
      age: updatedUser.age,
      email: updatedUser.email,
      education: updatedUser.education,
      contactDetails: updatedUser.contactDetails,
      phoneNumber: updatedUser.phoneNumber,
      role: updatedUser.role,
      isBlocked: updatedUser.isBlocked,
      termsAccepted: updatedUser.termsAccepted,
      rentedBooksCount: updatedUser.rentedBooksCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const blockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isBlocked = true;
    await user.save();

    res.json({ message: "User blocked successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const unblockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isBlocked = false;
    await user.save();

    res.json({ message: "User unblocked successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllRentals = async (req, res) => {
  try {
    const rentals = await RentalRequest.find()
      .populate("user", "name email phoneNumber")
      .populate("book")
      .sort({ createdAt: -1 });

    res.json(rentals);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllUsers,
  updateUserByAdmin,
  blockUser,
  unblockUser,
  getAllBooks,
  getAllRentals,
};