const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    place: { type: String, required: true, trim: true },
    age: { type: Number, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    education: { type: String, required: true, trim: true },
    contactDetails: { type: String, required: true, trim: true },
    phoneNumber: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isBlocked: { type: Boolean, default: false },
    termsAccepted: { type: Boolean, default: false },
    rentedBooksCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);