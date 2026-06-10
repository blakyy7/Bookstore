const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI?.trim();

    console.log("MONGO_URI =", JSON.stringify(uri));

    await mongoose.connect(uri);

    console.log("MongoDB Connected");
  } catch (error) {
    console.log("MongoDB error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;