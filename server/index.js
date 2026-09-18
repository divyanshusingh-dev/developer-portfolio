const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Contact Schema
const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Contact Model
const Contact = mongoose.model("Contact", contactSchema);

// Home / Test route
app.get("/", (req, res) => {
  res.json({
    message: "Divyanshu Singh Portfolio Backend is running!",
  });
});

// Contact form API
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Check required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email and message are required.",
      });
    }

    // Save contact message to MongoDB
    const newContact = new Contact({
      name,
      email,
      message,
    });

    await newContact.save();

    console.log("New Contact Message Saved:");
    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Message:", message);

    res.status(200).json({
      success: true,
      message: "Your message has been received successfully!",
    });
  } catch (error) {
    console.error("MongoDB Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to save your message.",
    });
  }
});

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully!");

    app.listen(PORT, () => {
      console.log(`Backend server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });