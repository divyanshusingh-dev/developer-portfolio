require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { Resend } = require("resend");

const app = express();

const PORT = process.env.PORT || 5000;

// --------------------------------------------------
// CORS
// --------------------------------------------------

const allowedProductionOrigin =
  "https://developer-portfolio-six-rouge.vercel.app";

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      if (origin === allowedProductionOrigin) {
        return callback(null, true);
      }

      if (
        /^http:\/\/localhost:\d+$/.test(origin) ||
        /^http:\/\/127\.0\.0\.1:\d+$/.test(origin)
      ) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },

    methods: ["GET", "POST", "PATCH", "OPTIONS"],

    allowedHeaders: [
      "Content-Type",
      "X-Admin-Password",
    ],
  })
);

app.use(express.json());

// --------------------------------------------------
// MongoDB Connection
// --------------------------------------------------

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  console.error("❌ MONGODB_URI is missing in .env");
  process.exit(1);
}

// --------------------------------------------------
// Contact Schema
// --------------------------------------------------

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

// --------------------------------------------------
// Protected PDF Schema
// --------------------------------------------------

const protectedPdfSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    contentType: {
      type: String,
      default: "application/pdf",
    },

    size: {
      type: Number,
      required: true,
    },

    data: {
      type: Buffer,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ProtectedPdf = mongoose.model(
  "ProtectedPdf",
  protectedPdfSchema
);

// --------------------------------------------------
// PDF Security Schema
// --------------------------------------------------

const pdfSecuritySchema = new mongoose.Schema(
  {
    key: {
      type: String,
      unique: true,
      default: "global",
    },

    masterProtected: {
      type: Boolean,
      default: true,
    },

    files: {
      type: [
        {
          fileName: {
            type: String,
            required: true,
          },

          protected: {
            type: Boolean,
            default: true,
          },
        },
      ],

      default: [],
    },
  },

  {
    timestamps: true,
  }
);

const PdfSecurity = mongoose.model(
  "PdfSecurity",
  pdfSecuritySchema
);

// --------------------------------------------------
// Protected PDF Configuration
// --------------------------------------------------

const protectedPdfConfig = {
  "10th-marksheet.pdf": {
    passwordEnv: "PDF_10TH_PASSWORD",
    protectedEnv: "PDF_10TH_PROTECTED",
  },

  "12th-marksheet.pdf": {
    passwordEnv: "PDF_12TH_PASSWORD",
    protectedEnv: "PDF_12TH_PROTECTED",
  },

  "1st-semester-dmc.pdf": {
    passwordEnv: "PDF_1ST_SEM_PASSWORD",
    protectedEnv: "PDF_1ST_SEM_PROTECTED",
  },

  "2nd-semester-dmc.pdf": {
    passwordEnv: "PDF_2ND_SEM_PASSWORD",
    protectedEnv: "PDF_2ND_SEM_PROTECTED",
  },

  "resume.pdf": {
    passwordEnv: "PDF_RESUME_PASSWORD",
    protectedEnv: "PDF_RESUME_PROTECTED",
  },
};

const protectedPdfNames = Object.keys(
  protectedPdfConfig
);

// --------------------------------------------------
// Create / Get PDF Security Settings
// --------------------------------------------------

async function getPdfSecuritySettings() {
  let settings = await PdfSecurity.findOne({
    key: "global",
  });

  if (!settings) {
    settings = await PdfSecurity.create({
      key: "global",

      masterProtected: true,

      files: protectedPdfNames.map((fileName) => ({
        fileName,

        protected:
          process.env[
            protectedPdfConfig[fileName].protectedEnv
          ] !== "false",
      })),
    });

    return settings;
  }

  let changed = false;

  for (const fileName of protectedPdfNames) {
    const existingFile = settings.files.find(
      (file) => file.fileName === fileName
    );

    if (!existingFile) {
      settings.files.push({
        fileName,

        protected:
          process.env[
            protectedPdfConfig[fileName].protectedEnv
          ] !== "false",
      });

      changed = true;
    }
  }

  if (changed) {
    await settings.save();
  }

  return settings;
}

// --------------------------------------------------
// Check Effective Protection
// --------------------------------------------------

async function isPdfProtected(fileName) {
  const settings = await getPdfSecuritySettings();

  const fileSetting = settings.files.find(
    (file) => file.fileName === fileName
  );

  const individualProtection = fileSetting
    ? fileSetting.protected
    : true;

  return (
    settings.masterProtected &&
    individualProtection
  );
}

// --------------------------------------------------
// Admin Authentication
// --------------------------------------------------

function checkAdminPassword(req, res, next) {
  const adminPassword =
    process.env.ADMIN_PANEL_PASSWORD;

  if (!adminPassword) {
    return res.status(500).json({
      message:
        "Admin panel password is not configured.",
    });
  }

  const providedPassword =
    req.get("X-Admin-Password");

  if (
    !providedPassword ||
    providedPassword !== adminPassword
  ) {
    return res.status(401).json({
      message: "Unauthorized.",
    });
  }

  next();
}

// --------------------------------------------------
// Health Check
// --------------------------------------------------

app.get("/", (req, res) => {
  res.json({
    message:
      "Developer Portfolio Backend is running!",
  });
});

// --------------------------------------------------
// Admin Login
// --------------------------------------------------

app.post("/api/admin/login", (req, res) => {
  const adminPassword =
    process.env.ADMIN_PANEL_PASSWORD;

  if (!adminPassword) {
    return res.status(500).json({
      message:
        "Admin panel password is not configured.",
    });
  }

  const { password } = req.body;

  if (
    !password ||
    password !== adminPassword
  ) {
    return res.status(401).json({
      message: "Incorrect admin password.",
    });
  }

  return res.json({
    success: true,
    message: "Admin login successful.",
  });
});

// --------------------------------------------------
// Admin Security Status
// --------------------------------------------------

app.get(
  "/api/admin/security",
  checkAdminPassword,
  async (req, res) => {
    try {
      const settings =
        await getPdfSecuritySettings();

      return res.json({
        masterProtected:
          settings.masterProtected,

        files: settings.files.map((file) => ({
          fileName: file.fileName,

          protected:
            file.protected,
        })),
      });
    } catch (error) {
      console.error(
        "Admin security status error:",
        error
      );

      return res.status(500).json({
        message:
          "Unable to load security settings.",
      });
    }
  }
);

// --------------------------------------------------
// Admin Master Toggle
// --------------------------------------------------

app.patch(
  "/api/admin/security/master",
  checkAdminPassword,
  async (req, res) => {
    try {
      const { protected: protectedValue } =
        req.body;

      if (
        typeof protectedValue !== "boolean"
      ) {
        return res.status(400).json({
          message:
            "The protected value must be true or false.",
        });
      }

      const settings =
        await getPdfSecuritySettings();

      settings.masterProtected =
        protectedValue;

      await settings.save();

      return res.json({
        success: true,

        masterProtected:
          settings.masterProtected,

        message: protectedValue
          ? "Password protection enabled for all PDFs."
          : "Password protection disabled for all PDFs.",
      });
    } catch (error) {
      console.error(
        "Master toggle error:",
        error
      );

      return res.status(500).json({
        message:
          "Unable to update master protection.",
      });
    }
  }
);

// --------------------------------------------------
// Admin Individual PDF Toggle
// --------------------------------------------------

app.patch(
  "/api/admin/security/pdf/:fileName",
  checkAdminPassword,
  async (req, res) => {
    try {
      const { fileName } = req.params;

      if (!protectedPdfConfig[fileName]) {
        return res.status(400).json({
          message: "Invalid PDF file.",
        });
      }

      const { protected: protectedValue } =
        req.body;

      if (
        typeof protectedValue !== "boolean"
      ) {
        return res.status(400).json({
          message:
            "The protected value must be true or false.",
        });
      }

      const settings =
        await getPdfSecuritySettings();

      const fileSetting =
        settings.files.find(
          (file) =>
            file.fileName === fileName
        );

      if (!fileSetting) {
        settings.files.push({
          fileName,

          protected:
            protectedValue,
        });
      } else {
        fileSetting.protected =
          protectedValue;
      }

      await settings.save();

      const effectiveProtection =
        settings.masterProtected &&
        protectedValue;

      return res.json({
        success: true,

        fileName,

        protected:
          protectedValue,

        effectiveProtected:
          effectiveProtection,

        message: protectedValue
          ? "Password protection enabled for this PDF."
          : "Password protection disabled for this PDF.",
      });
    } catch (error) {
      console.error(
        "Individual PDF toggle error:",
        error
      );

      return res.status(500).json({
        message:
          "Unable to update PDF protection.",
      });
    }
  }
);

// --------------------------------------------------
// Protected PDF Status
// --------------------------------------------------

app.get(
  "/api/protected-pdf/status/:fileName",
  async (req, res) => {
    try {
      const { fileName } = req.params;

      if (!protectedPdfConfig[fileName]) {
        return res.status(400).json({
          message: "Invalid PDF file.",
        });
      }

      const pdfExists =
        await ProtectedPdf.exists({
          fileName,
        });

      if (!pdfExists) {
        return res.status(404).json({
          message: "PDF file not found.",
        });
      }

      return res.json({
        fileName,

        protected:
          await isPdfProtected(fileName),
      });
    } catch (error) {
      console.error(
        "PDF status error:",
        error
      );

      return res.status(500).json({
        message:
          "Unable to check PDF status.",
      });
    }
  }
);

// --------------------------------------------------
// Protected PDF Download
// --------------------------------------------------

app.post(
  "/api/protected-pdf",
  async (req, res) => {
    try {
      const {
        fileName,
        password,
      } = req.body;

      if (!fileName) {
        return res.status(400).json({
          message:
            "PDF file name is required.",
        });
      }

      if (!protectedPdfConfig[fileName]) {
        return res.status(400).json({
          message: "Invalid PDF file.",
        });
      }

      const config =
        protectedPdfConfig[fileName];

      const pdf =
        await ProtectedPdf.findOne({
          fileName,
        });

      if (!pdf) {
        return res.status(404).json({
          message: "PDF file not found.",
        });
      }

      const protectedStatus =
        await isPdfProtected(fileName);

      if (protectedStatus) {
        const correctPassword =
          process.env[
            config.passwordEnv
          ];

        if (!correctPassword) {
          console.error(
            `❌ Missing password environment variable: ${config.passwordEnv}`
          );

          return res.status(500).json({
            message:
              "PDF protection is not configured correctly.",
          });
        }

        if (
          password !== correctPassword
        ) {
          return res.status(401).json({
            message:
              "Incorrect password.",
          });
        }
      }

      res.setHeader(
        "Content-Type",
        pdf.contentType ||
          "application/pdf"
      );

      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${fileName}"`
      );

      return res.send(pdf.data);
    } catch (error) {
      console.error(
        "PDF download error:",
        error
      );

      return res.status(500).json({
        message:
          "Unable to download PDF.",
      });
    }
  }
);

// --------------------------------------------------
// HTML Escape Helper
// --------------------------------------------------

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// --------------------------------------------------
// Resend
// --------------------------------------------------

const resendApiKey =
  process.env.RESEND_API_KEY;

const resendToEmail =
  process.env.RESEND_TO_EMAIL;

const resend = resendApiKey
  ? new Resend(resendApiKey)
  : null;

// --------------------------------------------------
// Contact Form
// --------------------------------------------------

app.post(
  "/api/contact",
  async (req, res) => {
    try {
      const {
        name,
        email,
        phone,
        purpose,
        message,
      } = req.body;

      if (
        !name ||
        !email ||
        !purpose ||
        !message
      ) {
        return res.status(400).json({
          message:
            "Name, email, purpose and message are required.",
        });
      }

      const newContact =
        await Contact.create({
          name,
          email,
          phone: phone || "",
          purpose,
          message,
        });

      console.log(
        "\nNew Contact Message Saved:"
      );

      console.log("Name:", name);
      console.log("Email:", email);
      console.log(
        "Phone:",
        phone || "Not provided"
      );
      console.log(
        "Purpose:",
        purpose
      );
      console.log(
        "Message:",
        message
      );

      if (
        resend &&
        resendToEmail
      ) {
        const safeName =
          escapeHtml(name);

        const safeEmail =
          escapeHtml(email);

        const safePhone =
          escapeHtml(
            phone || "Not provided"
          );

        const safePurpose =
          escapeHtml(purpose);

        const safeMessage =
          escapeHtml(
            message
          ).replace(
            /\n/g,
            "<br>"
          );

        const emailResult =
          await resend.emails.send({
            from:
              "Developer Portfolio <onboarding@resend.dev>",

            to: resendToEmail,

            subject:
              `New Portfolio Contact: ${name}`,

            html: `
              <div style="
                font-family: Arial, sans-serif;
                max-width: 700px;
                margin: auto;
                padding: 24px;
                background: #f8fafc;
              ">
                <div style="
                  background: #ffffff;
                  border-radius: 14px;
                  padding: 28px;
                  border: 1px solid #e2e8f0;
                ">
                  <h2 style="margin-top: 0;">
                    New Contact Form Message
                  </h2>

                  <p>
                    <strong>Name:</strong>
                    ${safeName}
                  </p>

                  <p>
                    <strong>Email:</strong>
                    ${safeEmail}
                  </p>

                  <p>
                    <strong>Phone:</strong>
                    ${safePhone}
                  </p>

                  <p>
                    <strong>Purpose:</strong>
                    ${safePurpose}
                  </p>

                  <div style="
                    margin-top: 20px;
                    padding: 18px;
                    background: #f1f5f9;
                    border-radius: 10px;
                  ">
                    <strong>Message:</strong>
                    <p>${safeMessage}</p>
                  </div>

                  <p style="
                    margin-top: 24px;
                    color: #64748b;
                    font-size: 13px;
                  ">
                    This message was submitted through the
                    Developer Portfolio contact form.
                  </p>
                </div>
              </div>
            `,
          });

        if (emailResult.error) {
          console.error(
            "❌ Email notification failed:",
            emailResult.error
          );
        } else {
          console.log(
            "✅ Email notification sent successfully:",
            emailResult.data?.id
          );
        }
      } else {
        console.log(
          "⚠️ Resend is not configured. Message was saved to MongoDB only."
        );
      }

      return res.status(201).json({
        message:
          "Message sent successfully!",

        contactId:
          newContact._id,
      });
    } catch (error) {
      console.error(
        "❌ Contact form error:",
        error
      );

      return res.status(500).json({
        message:
          "Something went wrong. Please try again.",
      });
    }
  }
);

// --------------------------------------------------
// Start Server
// --------------------------------------------------

async function startServer() {
  try {
    await mongoose.connect(
      mongoUri
    );

    console.log(
      "MongoDB connected successfully!"
    );

    await getPdfSecuritySettings();

    console.log(
      "PDF security settings initialized!"
    );

    app.listen(
      PORT,
      () => {
        console.log(
          `Backend server running on http://localhost:${PORT}`
        );
      }
    );
  } catch (error) {
    console.error(
      "❌ MongoDB connection failed:",
      error.message
    );

    process.exit(1);
  }
}

startServer();