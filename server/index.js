const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { Resend } = require("resend");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Resend
const resend = new Resend(process.env.RESEND_API_KEY);

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

    // Send email notification
    const { data, error } = await resend.emails.send({
      from: "Portfolio <onboarding@resend.dev>",
      to: [process.env.RESEND_TO_EMAIL],
      subject: `New Portfolio Message from ${name}`,
      html: `
        <h2>New Contact Form Message</h2>

        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>

        <p><strong>Message:</strong></p>
        <p>${message}</p>

        <hr />

        <p>
          This message was submitted through your
          <strong>Divyanshu Singh Portfolio</strong>.
        </p>
      `,
    });

    if (error) {
      console.error("Resend Email Error:", error);

      return res.status(200).json({
        success: true,
        message:
          "Your message has been received successfully, but email notification could not be sent.",
      });
    }

    console.log("Email notification sent successfully:", data?.id);

    res.status(200).json({
      success: true,
      message: "Your message has been received successfully!",
    });
  } catch (error) {
    console.error("Server Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to process your message.",
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