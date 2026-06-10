const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const RentalRequest = require("./models/RentalRequest");
const sendEmail = require("./utils/sendEmail");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Bookstore Backend Running");
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/books", require("./routes/bookRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/rentals", require("./routes/rentalRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/social", require("./routes/socialRoutes"));

const checkExpiredRentals = async () => {
  try {
    const now = new Date();

    const expiredRentals = await RentalRequest.find({
      status: "approved",
      dueDate: { $lte: now },
      expiryEmailSent: false,
    })
      .populate("user", "name email")
      .populate("book", "title");

    for (const rental of expiredRentals) {
      if (rental.user?.email) {
        await sendEmail({
          to: rental.user.email,
          subject: "Book Rental Expired",
          text: `Hello ${rental.user.name}, your rental period for "${rental.book.title}" has expired. Please return the book soon.`,
        });
      }

      rental.expiryEmailSent = true;
      await rental.save();
    }

    if (expiredRentals.length > 0) {
      console.log(`Sent ${expiredRentals.length} expiry email(s)`);
    }
  } catch (error) {
    console.log("Expiry email check error:", error.message);
  }
};

// Run every 1 hour
setInterval(checkExpiredRentals, 60 * 60 * 1000);

// Run once after server starts
setTimeout(checkExpiredRentals, 10 * 1000);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});