const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    uniqueId: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    publicationYear: { type: Number, required: true },
    genre: { type: String, required: true, trim: true },
    isbn: { type: String, required: true, unique: true, trim: true },
    availabilityStatus: { type: Boolean, default: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Book", bookSchema);