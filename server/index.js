const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { Resend } = require("resend");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

/* =========================
   Middleware
========================= */

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://developer-portfolio-six-rouge.vercel.app",
    ],
    methods: ["GET", "POST"],
  })
);

app.use(express.json());

/* =========================
   Resend
========================= */

const resend = new Resend(process.env.RESEND_API_KEY);

/* =========================
   MongoDB Connection
========================= */

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully!");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

/* =========================
   Contact Schema
========================= */

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      trim: true,
      default: "",
    },

    purpose: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Contact = mongoose.model("Contact", contactSchema);

/* =========================
   Home Route
========================= */

app.get("/", (req, res) => {
  res.send("Portfolio Backend is running successfully!");
});

/* =========================
   Contact Form Route
========================= */

app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, phone, purpose, message } = req.body;

    /* =========================
       Validation
    ========================= */

    if (!name || !email || !purpose || !message) {
      return res.status(400).json({
        message: "Please fill all required fields.",
      });
    }

    /* =========================
       Save Contact Message
    ========================= */

    const newContact = new Contact({
      name,
      email,
      phone: phone || "",
      purpose,
      message,
    });

    await newContact.save();

    console.log("New Contact Message Saved:");
    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Phone:", phone || "Not provided");
    console.log("Purpose:", purpose);
    console.log("Message:", message);

    /* =========================
       Send Email Notification
    ========================= */

    const { data, error } = await resend.emails.send({
      from: "Portfolio <onboarding@resend.dev>",
      to: process.env.RESEND_TO_EMAIL,
      subject: `New Portfolio Message from ${name}`,

      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8" />
            <title>New Portfolio Message</title>
          </head>

          <body
            style="
              margin: 0;
              padding: 0;
              background-color: #f4f4f5;
              font-family: Arial, Helvetica, sans-serif;
            "
          >
            <div
              style="
                max-width: 650px;
                margin: 30px auto;
                background-color: #ffffff;
                border-radius: 12px;
                overflow: hidden;
                border: 1px solid #e4e4e7;
              "
            >

              <!-- Header -->
              <div
                style="
                  background-color: #020617;
                  padding: 28px 30px;
                "
              >
                <h1
                  style="
                    margin: 0;
                    color: #22d3ee;
                    font-size: 24px;
                  "
                >
                  New Portfolio Message
                </h1>

                <p
                  style="
                    margin: 8px 0 0;
                    color: #cbd5e1;
                    font-size: 14px;
                  "
                >
                  Someone submitted the contact form on your portfolio.
                </p>
              </div>

              <!-- Content -->
              <div style="padding: 30px;">

                <!-- Name -->
                <div style="margin-bottom: 22px;">
                  <p
                    style="
                      margin: 0 0 6px;
                      color: #64748b;
                      font-size: 12px;
                      font-weight: bold;
                      text-transform: uppercase;
                      letter-spacing: 1px;
                    "
                  >
                    Name
                  </p>

                  <p
                    style="
                      margin: 0;
                      color: #0f172a;
                      font-size: 16px;
                      font-weight: 600;
                    "
                  >
                    ${name}
                  </p>
                </div>

                <!-- Email -->
                <div style="margin-bottom: 22px;">
                  <p
                    style="
                      margin: 0 0 6px;
                      color: #64748b;
                      font-size: 12px;
                      font-weight: bold;
                      text-transform: uppercase;
                      letter-spacing: 1px;
                    "
                  >
                    Email
                  </p>

                  <p
                    style="
                      margin: 0;
                      color: #0f172a;
                      font-size: 16px;
                    "
                  >
                    <a
                      href="mailto:${email}"
                      style="
                        color: #0891b2;
                        text-decoration: none;
                      "
                    >
                      ${email}
                    </a>
                  </p>
                </div>

                <!-- Phone -->
                <div style="margin-bottom: 22px;">
                  <p
                    style="
                      margin: 0 0 6px;
                      color: #64748b;
                      font-size: 12px;
                      font-weight: bold;
                      text-transform: uppercase;
                      letter-spacing: 1px;
                    "
                  >
                    Phone
                  </p>

                  <p
                    style="
                      margin: 0;
                      color: #0f172a;
                      font-size: 16px;
                    "
                  >
                    ${phone || "Not provided"}
                  </p>
                </div>

                <!-- Purpose -->
                <div style="margin-bottom: 22px;">
                  <p
                    style="
                      margin: 0 0 6px;
                      color: #64748b;
                      font-size: 12px;
                      font-weight: bold;
                      text-transform: uppercase;
                      letter-spacing: 1px;
                    "
                  >
                    Purpose
                  </p>

                  <p
                    style="
                      display: inline-block;
                      margin: 0;
                      padding: 7px 12px;
                      background-color: #ecfeff;
                      color: #0891b2;
                      border-radius: 6px;
                      font-size: 14px;
                      font-weight: 600;
                    "
                  >
                    ${purpose}
                  </p>
                </div>

                <!-- Message -->
                <div style="margin-bottom: 10px;">
                  <p
                    style="
                      margin: 0 0 8px;
                      color: #64748b;
                      font-size: 12px;
                      font-weight: bold;
                      text-transform: uppercase;
                      letter-spacing: 1px;
                    "
                  >
                    Message
                  </p>

                  <div
                    style="
                      background-color: #f8fafc;
                      border: 1px solid #e2e8f0;
                      border-radius: 8px;
                      padding: 16px;
                      color: #334155;
                      font-size: 15px;
                      line-height: 1.7;
                      white-space: pre-wrap;
                    "
                  >
                    ${message}
                  </div>
                </div>

              </div>

              <!-- Footer -->
              <div
                style="
                  background-color: #f8fafc;
                  border-top: 1px solid #e2e8f0;
                  padding: 18px 30px;
                "
              >
                <p
                  style="
                    margin: 0;
                    color: #64748b;
                    font-size: 12px;
                    text-align: center;
                  "
                >
                  This message was submitted through the
                  <strong>Divyanshu Singh Portfolio</strong>.
                </p>
              </div>

            </div>
          </body>
        </html>
      `,
    });

    /* =========================
       Resend Error Handling
    ========================= */

    if (error) {
      console.error("Resend email error:", error);

      return res.status(500).json({
        message:
          "Message was saved successfully, but email notification could not be sent.",
      });
    }

    console.log("Email notification sent successfully:", data?.id);

    /* =========================
       Success Response
    ========================= */

    return res.status(200).json({
      message: "Message sent successfully!",
    });
  } catch (error) {
    console.error("Contact form error:", error);

    return res.status(500).json({
      message: "Server error. Please try again later.",
    });
  }
});

/* =========================
   Start Server
========================= */

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});