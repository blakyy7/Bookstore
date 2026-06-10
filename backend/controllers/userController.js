const User = require("../models/User");
const RentalRequest = require("../models/RentalRequest");
const bcrypt = require("bcryptjs");

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

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
    } = req.body;

    if (name !== undefined) user.name = name;
    if (place !== undefined) user.place = place;
    if (age !== undefined) user.age = age;
    if (email !== undefined) user.email = email;
    if (education !== undefined) user.education = education;
    if (contactDetails !== undefined)
      user.contactDetails = contactDetails;
    if (phoneNumber !== undefined)
      user.phoneNumber = phoneNumber;

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
      rentedBooksCount: updatedUser.rentedBooksCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyRentedBooksCount = async (req, res) => {
  try {
    const count = await RentalRequest.countDocuments({
      user: req.user._id,
      status: "approved",
    });

    res.json({ rentedBooksCount: count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMe,
  updateMe,
  getMyRentedBooksCount,
};