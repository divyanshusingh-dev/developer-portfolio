require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const crypto = require("crypto");
const multer = require("multer");
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
    origin(origin, callback) {
      if (!origin) return callback(null, true);

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
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "X-Admin-Password"],
  })
);

app.use(express.json());

// --------------------------------------------------
// MongoDB
// --------------------------------------------------

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  console.error("MONGODB_URI is not configured.");
} else {
  mongoose
    .connect(mongoUri)
    .then(() => console.log("MongoDB connected successfully!"))
    .catch((error) => console.error("MongoDB connection error:", error));
}

// --------------------------------------------------
// Resend
// --------------------------------------------------

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

// --------------------------------------------------
// Contact Schema
// --------------------------------------------------

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: { type: String, trim: true, default: "" },
    purpose: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const Contact = mongoose.model("Contact", contactSchema);

// --------------------------------------------------
// PDF Fixed Slots
// --------------------------------------------------

const PDF_SLOTS = {
  classX: {
    displayName: "10th Marksheet",
    fileName: "10th-marksheet.pdf",
  },
  classXII: {
    displayName: "12th Marksheet",
    fileName: "12th-marksheet.pdf",
  },
  classXMigration: {
    displayName: "10th Migration Certificate",
    fileName: "10th-Migration Certificate.pdf",
  },
  classXIIMigration: {
    displayName: "12th Migration Certificate",
    fileName: "12th-Migration Certificate.pdf",
  },
  firstSemester: {
    displayName: "First Semester",
    fileName: "1st-semester-dmc.pdf",
  },
  secondSemester: {
    displayName: "Second Semester",
    fileName: "2nd-semester-dmc.pdf",
  },
  thirdSemester: {
    displayName: "Third Semester",
    fileName: "3rd-semester-dmc.pdf",
  },
  fourthSemester: {
    displayName: "Fourth Semester",
    fileName: "4th-semester-dmc.pdf",
  },
  fifthSemester: {
    displayName: "Fifth Semester",
    fileName: "5th-semester-dmc.pdf",
  },
  sixthSemester: {
    displayName: "Sixth Semester",
    fileName: "6th-semester-dmc.pdf",
  },
  degreeCertificate: {
    displayName: "Degree Certificate",
    fileName: "degree-certificate.pdf",
  },
  resume: {
    displayName: "Resume",
    fileName: "resume.pdf",
  },
};

const PDF_SLOT_ORDER = [
  "classX",
  "classXII",
  "classXMigration",
  "classXIIMigration",
  "firstSemester",
  "secondSemester",
  "thirdSemester",
  "fourthSemester",
  "fifthSemester",
  "sixthSemester",
  "degreeCertificate",
  "resume",
];

const SEMESTER_SLOT_KEYS = [
  "firstSemester",
  "secondSemester",
  "thirdSemester",
  "fourthSemester",
  "fifthSemester",
  "sixthSemester",
];

const DEFAULT_PROTECTION = {
  firstSemester: true,
  secondSemester: true,
  thirdSemester: true,
  fourthSemester: true,
  fifthSemester: true,
  sixthSemester: true,
  classXII: true,
  classXIIMigration: true,
  classXMigration: true,
  classX: true,
  resume: false,
};

const DEFAULT_SGPA = {
  firstSemester: 8.72,
  secondSemester: 8.95,
  thirdSemester: 8.78,
  fourthSemester: null,
  fifthSemester: null,
  sixthSemester: null,
};

const DEFAULT_PERCENTAGE = {
  classX: 70.4,
  classXII: 60.4,
};

const PDF_FILE_NAMES = new Set(
  PDF_SLOT_ORDER.map((slotKey) => PDF_SLOTS[slotKey].fileName)
);

// --------------------------------------------------
// Protected PDF Schema
// --------------------------------------------------

const protectedPdfSchema = new mongoose.Schema(
  {
    fileName: { type: String, required: true, unique: true, index: true },
    displayName: { type: String, required: true },
    mimeType: { type: String, default: "application/pdf" },
    sizeBytes: { type: Number, default: 0 },
    data: { type: Buffer, required: true },
    passwordHash: { type: String, default: "" },
    passwordSalt: { type: String, default: "" },
  },
  { timestamps: true }
);

const ProtectedPdf = mongoose.model("ProtectedPdf", protectedPdfSchema);

// --------------------------------------------------
// PDF Security Settings Schema
// --------------------------------------------------

const pdfSettingSchema = new mongoose.Schema(
  {
    fileName: { type: String, required: true },
    protected: { type: Boolean, default: true },
    enabled: { type: Boolean, default: true },
    sgpa: { type: Number, default: null },
    percentage: { type: Number, default: null },
  },
  { _id: false }
);

const pdfSecuritySchema = new mongoose.Schema(
  {
    masterProtected: { type: Boolean, default: true },
    files: { type: [pdfSettingSchema], default: [] },
  },
  { timestamps: true }
);

const PdfSecurity = mongoose.model("PdfSecurity", pdfSecuritySchema);

// --------------------------------------------------
// Password Helpers
// --------------------------------------------------

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return { hash, salt };
}

function verifyHashedPassword(password, hash, salt) {
  if (!hash || !salt) return false;

  try {
    const derived = crypto.scryptSync(password, salt, 64);
    const stored = Buffer.from(hash, "hex");

    return (
      stored.length === derived.length &&
      crypto.timingSafeEqual(stored, derived)
    );
  } catch {
    return false;
  }
}

const LEGACY_ENV_PASSWORDS = {
  "10th-marksheet.pdf": process.env.PDF_10TH_PASSWORD,
  "12th-marksheet.pdf": process.env.PDF_12TH_PASSWORD,
  "10th-Migration Certificate.pdf": process.env.PDF_10TH_MIGRATION_PASSWORD,
  "12th-Migration Certificate.pdf": process.env.PDF_MIGRATION_PASSWORD,
  "1st-semester-dmc.pdf": process.env.PDF_1ST_SEM_PASSWORD,
  "2nd-semester-dmc.pdf": process.env.PDF_2ND_SEM_PASSWORD,
  "resume.pdf": process.env.PDF_RESUME_PASSWORD,
};

async function verifyPdfPassword(file, password, fileName) {
  if (
    verifyHashedPassword(
      password,
      file.passwordHash,
      file.passwordSalt
    )
  ) {
    return true;
  }

  const legacyPassword = LEGACY_ENV_PASSWORDS[fileName];
  return Boolean(legacyPassword && password === legacyPassword);
}

// --------------------------------------------------
// PDF Settings Helpers
// --------------------------------------------------

function findSlotKeyByFileName(fileName) {
  return PDF_SLOT_ORDER.find(
    (slotKey) => PDF_SLOTS[slotKey].fileName === fileName
  );
}

function createDefaultSetting(slotKey) {
  return {
    fileName: PDF_SLOTS[slotKey].fileName,
    protected: DEFAULT_PROTECTION[slotKey] ?? true,
    enabled: true,
    sgpa: Object.prototype.hasOwnProperty.call(DEFAULT_SGPA, slotKey)
      ? DEFAULT_SGPA[slotKey]
      : null,
    percentage: Object.prototype.hasOwnProperty.call(
      DEFAULT_PERCENTAGE,
      slotKey
    )
      ? DEFAULT_PERCENTAGE[slotKey]
      : null,
  };
}

async function getPdfSecuritySettings() {
  let settings = await PdfSecurity.findOne();

  if (!settings) {
    settings = await PdfSecurity.create({
      masterProtected: true,
      files: PDF_SLOT_ORDER.map(createDefaultSetting),
    });

    return settings;
  }

  const normalizedFiles = PDF_SLOT_ORDER.map((slotKey) => {
    const slot = PDF_SLOTS[slotKey];
    const existing = settings.files.find(
      (item) => item.fileName === slot.fileName
    );

    if (!existing) {
      return createDefaultSetting(slotKey);
    }

    if (typeof existing.protected !== "boolean") {
      existing.protected = DEFAULT_PROTECTION[slotKey];
    }

    if (typeof existing.enabled !== "boolean") {
      existing.enabled = true;
    }

    if (
      SEMESTER_SLOT_KEYS.includes(slotKey) &&
      (existing.sgpa === undefined || existing.sgpa === null) &&
      DEFAULT_SGPA[slotKey] !== null
    ) {
      existing.sgpa = DEFAULT_SGPA[slotKey];
    }

    if (!SEMESTER_SLOT_KEYS.includes(slotKey)) {
      existing.sgpa = null;
    }

    if (
      Object.prototype.hasOwnProperty.call(DEFAULT_PERCENTAGE, slotKey) &&
      (existing.percentage === undefined || existing.percentage === null)
    ) {
      existing.percentage = DEFAULT_PERCENTAGE[slotKey];
    }

    if (!Object.prototype.hasOwnProperty.call(DEFAULT_PERCENTAGE, slotKey)) {
      existing.percentage = null;
    }

    return existing;
  });

  settings.files = normalizedFiles;
  await settings.save();
  return settings;
}

async function getPdfByFileName(fileName) {
  if (!PDF_FILE_NAMES.has(fileName)) return null;
  return ProtectedPdf.findOne({ fileName });
}

async function isEffectivelyProtected(fileName) {
  const settings = await getPdfSecuritySettings();
  const setting = settings.files.find(
    (item) => item.fileName === fileName
  );

  return Boolean(
    settings.masterProtected && setting?.protected
  );
}

function isKnownSemesterSlot(slotKey) {
  return SEMESTER_SLOT_KEYS.includes(slotKey);
}

function parseSgpa(value) {
  if (value === undefined || value === null || String(value).trim() === "") {
    return null;
  }

  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric < 0 || numeric > 10) {
    return NaN;
  }

  return Math.round(numeric * 100) / 100;
}

function parsePercentage(value) {
  if (value === undefined || value === null || String(value).trim() === "") {
    return null;
  }

  const numeric = Number(value);
  if (!Number.isFinite(numeric) || numeric < 0 || numeric > 100) {
    return NaN;
  }

  return Math.round(numeric * 100) / 100;
}

function calculateCgpa(settings) {
  const values = settings.files
    .filter((item) => SEMESTER_SLOT_KEYS.some((slotKey) => PDF_SLOTS[slotKey].fileName === item.fileName))
    .map((item) => item.sgpa)
    .filter((value) => typeof value === "number" && Number.isFinite(value));

  if (values.length === 0) return null;

  const total = values.reduce((sum, value) => sum + value, 0);
  return Math.round((total / values.length) * 100) / 100;
}

// --------------------------------------------------
// Multer
// --------------------------------------------------

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter(_req, file, callback) {
    const isPdf =
      file.mimetype === "application/pdf" ||
      file.originalname.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      return callback(new Error("Only PDF files are allowed."));
    }

    callback(null, true);
  },
});

// --------------------------------------------------
// Admin Auth
// --------------------------------------------------

function requireAdmin(req, res, next) {
  const expected = process.env.ADMIN_PANEL_PASSWORD;
  const provided = req.header("X-Admin-Password");

  if (!expected || !provided || provided !== expected) {
    return res.status(401).json({
      message: "Incorrect admin password.",
    });
  }

  next();
}

// --------------------------------------------------
// Home
// --------------------------------------------------

app.get("/", (_req, res) => {
  res.send("Portfolio Backend is running successfully!");
});

// --------------------------------------------------
// Contact Form
// --------------------------------------------------

app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, phone, purpose, message } = req.body || {};

    if (!name || !email || !purpose || !message) {
      return res.status(400).json({
        message: "Please fill all required fields.",
      });
    }

    const newContact = await Contact.create({
      name,
      email,
      phone: phone || "",
      purpose,
      message,
    });

    if (resend && process.env.RESEND_TO_EMAIL) {
      try {
        await resend.emails.send({
          from: "Portfolio <onboarding@resend.dev>",
          to: process.env.RESEND_TO_EMAIL,
          subject: `New Portfolio Message from ${name}`,
          html: `
            <div style="font-family:Arial,sans-serif;max-width:650px;margin:0 auto;padding:24px">
              <h2>New Portfolio Message</h2>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
              <p><strong>Purpose:</strong> ${purpose}</p>
              <p><strong>Message:</strong> ${message}</p>
            </div>
          `,
        });
      } catch (emailError) {
        console.error("Resend email error:", emailError);
      }
    }

    return res.status(201).json({
      message: "Message sent successfully!",
      contactId: newContact._id,
    });
  } catch (error) {
    console.error("Contact form error:", error);

    return res.status(500).json({
      message: "Unable to send message.",
    });
  }
});

// --------------------------------------------------
// ADMIN LOGIN
// --------------------------------------------------

app.post("/api/admin/login", (req, res) => {
  const expected = process.env.ADMIN_PANEL_PASSWORD;
  const provided = String(req.body?.password || "");

  if (!expected || !provided || provided !== expected) {
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
// ADMIN SECURITY - READ
// --------------------------------------------------

app.get("/api/admin/security", requireAdmin, async (_req, res) => {
  try {
    const settings = await getPdfSecuritySettings();

    const documents = await ProtectedPdf.find(
      {},
      {
        fileName: 1,
        displayName: 1,
        mimeType: 1,
        sizeBytes: 1,
        createdAt: 1,
        updatedAt: 1,
      }
    ).lean();

    const documentMap = new Map(
      documents.map((document) => [document.fileName, document])
    );

    const files = PDF_SLOT_ORDER.map((slotKey) => {
      const slot = PDF_SLOTS[slotKey];
      const setting = settings.files.find(
        (file) => file.fileName === slot.fileName
      );
      const document = documentMap.get(slot.fileName);

      return {
        slot: slotKey,
        fileName: slot.fileName,
        displayName: slot.displayName,
        isSemester: isKnownSemesterSlot(slotKey),
        protected: Boolean(setting?.protected),
        enabled: setting?.enabled !== false,
        effectiveProtected: Boolean(
          settings.masterProtected && setting?.protected
        ),
        sgpa:
          typeof setting?.sgpa === "number"
            ? setting.sgpa
            : null,
        sizeBytes: document?.sizeBytes || 0,
        uploadedAt:
          document?.updatedAt || document?.createdAt || null,
        builtIn: true,
        hasFile: Boolean(document),
        available: Boolean(document && setting?.enabled !== false),
      };
    });

    return res.json({
      masterProtected: Boolean(settings.masterProtected),
      files,
      overallCgpa: calculateCgpa(settings),
    });
  } catch (error) {
    console.error("Admin security read error:", error);

    return res.status(500).json({
      message: "Unable to load PDF security settings.",
    });
  }
});

// --------------------------------------------------
// MASTER PROTECTION
// --------------------------------------------------

app.patch(
  "/api/admin/security/master",
  requireAdmin,
  async (req, res) => {
    try {
      const settings = await getPdfSecuritySettings();
      settings.masterProtected = Boolean(req.body?.protected);
      await settings.save();

      return res.json({
        success: true,
        masterProtected: settings.masterProtected,
        message: settings.masterProtected
          ? "Password protection enabled for all PDFs."
          : "Password protection disabled for all PDFs.",
      });
    } catch (error) {
      console.error("Master protection error:", error);

      return res.status(500).json({
        message: "Unable to update master protection.",
      });
    }
  }
);

// --------------------------------------------------
// INDIVIDUAL PROTECTION
// --------------------------------------------------

app.patch(
  "/api/admin/security/pdf/:fileName",
  requireAdmin,
  async (req, res) => {
    try {
      const fileName = decodeURIComponent(req.params.fileName);
      const settings = await getPdfSecuritySettings();
      const target = settings.files.find(
        (file) => file.fileName === fileName
      );

      if (!target) {
        return res.status(404).json({
          message: "PDF slot not found.",
        });
      }

      target.protected = Boolean(req.body?.protected);
      await settings.save();

      const slotKey = findSlotKeyByFileName(fileName);

      return res.json({
        success: true,
        fileName,
        protected: target.protected,
        message: `${
          slotKey ? PDF_SLOTS[slotKey].displayName : fileName
        } protection ${target.protected ? "enabled" : "disabled"}.`,
      });
    } catch (error) {
      console.error("Individual protection error:", error);

      return res.status(500).json({
        message: "Unable to update PDF protection.",
      });
    }
  }
);

// --------------------------------------------------
// ENABLE / DISABLE PORTFOLIO SLOT
// --------------------------------------------------

app.patch(
  "/api/admin/security/slot/:slotKey/enabled",
  requireAdmin,
  async (req, res) => {
    try {
      const slotKey = String(req.params.slotKey || "");
      const slot = PDF_SLOTS[slotKey];

      if (!slot) {
        return res.status(404).json({
          message: "PDF slot not found.",
        });
      }

      const settings = await getPdfSecuritySettings();
      const target = settings.files.find(
        (file) => file.fileName === slot.fileName
      );

      if (!target) {
        return res.status(404).json({
          message: "PDF slot setting not found.",
        });
      }

      target.enabled = Boolean(req.body?.enabled);
      await settings.save();

      return res.json({
        success: true,
        slot: slotKey,
        enabled: target.enabled,
        available:
          target.enabled && Boolean(await getPdfByFileName(slot.fileName)),
        message: `${slot.displayName} is now ${
          target.enabled ? "enabled" : "disabled"
        } in the portfolio.`,
      });
    } catch (error) {
      console.error("Slot enable/disable error:", error);

      return res.status(500).json({
        message: "Unable to update PDF slot status.",
      });
    }
  }
);

// --------------------------------------------------
// UPDATE SGPA FOR ONE SEMESTER
// --------------------------------------------------

app.patch(
  "/api/admin/security/slot/:slotKey/sgpa",
  requireAdmin,
  async (req, res) => {
    try {
      const slotKey = String(req.params.slotKey || "");

      if (!isKnownSemesterSlot(slotKey)) {
        return res.status(400).json({
          message: "SGPA can only be updated for semester slots.",
        });
      }

      const parsed = parseSgpa(req.body?.sgpa);

      if (parsed === null || Number.isNaN(parsed)) {
        return res.status(400).json({
          message: "Enter a valid SGPA between 0 and 10.",
        });
      }

      const settings = await getPdfSecuritySettings();
      const fileName = PDF_SLOTS[slotKey].fileName;
      const target = settings.files.find(
        (file) => file.fileName === fileName
      );

      if (!target) {
        return res.status(404).json({
          message: "PDF slot setting not found.",
        });
      }

      target.sgpa = parsed;
      await settings.save();

      return res.json({
        success: true,
        slot: slotKey,
        sgpa: parsed,
        overallCgpa: calculateCgpa(settings),
        message: `${PDF_SLOTS[slotKey].displayName} SGPA saved as ${parsed}.`,
      });
    } catch (error) {
      console.error("SGPA update error:", error);

      return res.status(500).json({
        message: "Unable to update SGPA.",
      });
    }
  }
);

// --------------------------------------------------
// UPDATE PERCENTAGE FOR CLASS X / CLASS XII
// --------------------------------------------------

app.patch(
  "/api/admin/security/slot/:slotKey/percentage",
  requireAdmin,
  async (req, res) => {
    try {
      const slotKey = String(req.params.slotKey || "");

      if (!Object.prototype.hasOwnProperty.call(DEFAULT_PERCENTAGE, slotKey)) {
        return res.status(400).json({
          message: "Percentage can only be updated for Class X or Class XII.",
        });
      }

      const parsed = parsePercentage(req.body?.percentage);

      if (parsed === null || Number.isNaN(parsed)) {
        return res.status(400).json({
          message: "Enter a valid percentage between 0 and 100.",
        });
      }

      const settings = await getPdfSecuritySettings();
      const fileName = PDF_SLOTS[slotKey].fileName;
      const target = settings.files.find(
        (file) => file.fileName === fileName
      );

      if (!target) {
        return res.status(404).json({
          message: "PDF slot setting not found.",
        });
      }

      target.percentage = parsed;
      await settings.save();

      return res.json({
        success: true,
        slot: slotKey,
        percentage: parsed,
        message: `${PDF_SLOTS[slotKey].displayName} percentage saved as ${parsed}%.`,
      });
    } catch (error) {
      console.error("Percentage update error:", error);

      return res.status(500).json({
        message: "Unable to update percentage.",
      });
    }
  }
);

// --------------------------------------------------
// UPLOAD / REPLACE PDF
// --------------------------------------------------

app.post(
  "/api/admin/pdf/upload",
  requireAdmin,
  upload.single("pdf"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "Please select a PDF file.",
        });
      }

      const slotKey = String(req.body?.slot || "").trim();
      const slot = PDF_SLOTS[slotKey];

      if (!slot) {
        return res.status(400).json({
          message: "Please select a valid PDF slot.",
        });
      }

      const protectedValue = String(req.body?.protected) !== "false";
      const uploadPassword = String(req.body?.password || "");

      if (protectedValue && !uploadPassword.trim()) {
        return res.status(400).json({
          message: "Password is required when protection is ON.",
        });
      }

      const settings = await getPdfSecuritySettings();
      const existingSetting = settings.files.find(
        (file) => file.fileName === slot.fileName
      );

      let sgpa = existingSetting?.sgpa ?? null;
      let percentage = existingSetting?.percentage ?? null;

      if (Object.prototype.hasOwnProperty.call(DEFAULT_PERCENTAGE, slotKey)) {
        const submittedPercentage = parsePercentage(req.body?.percentage);

        if (submittedPercentage !== null) {
          if (Number.isNaN(submittedPercentage)) {
            return res.status(400).json({
              message: "Percentage must be between 0 and 100.",
            });
          }

          percentage = submittedPercentage;
        }

        if (percentage === null) {
          percentage = DEFAULT_PERCENTAGE[slotKey];
        }
      }

      if (isKnownSemesterSlot(slotKey)) {
        const submittedSgpa = parseSgpa(req.body?.sgpa);

        if (submittedSgpa !== null) {
          if (Number.isNaN(submittedSgpa)) {
            return res.status(400).json({
              message: "SGPA must be between 0 and 10.",
            });
          }

          sgpa = submittedSgpa;
        }

        if (sgpa === null) {
          return res.status(400).json({
            message: `${slot.displayName} requires an SGPA between 0 and 10.`,
          });
        }
      }

      const passwordData = protectedValue
        ? hashPassword(uploadPassword)
        : { hash: "", salt: "" };

      const existing = await ProtectedPdf.findOne({
        fileName: slot.fileName,
      });

      if (existing) {
        existing.displayName = slot.displayName;
        existing.mimeType = "application/pdf";
        existing.sizeBytes = req.file.buffer.length;
        existing.data = req.file.buffer;
        existing.passwordHash = passwordData.hash;
        existing.passwordSalt = passwordData.salt;
        await existing.save();
      } else {
        await ProtectedPdf.create({
          fileName: slot.fileName,
          displayName: slot.displayName,
          mimeType: "application/pdf",
          sizeBytes: req.file.buffer.length,
          data: req.file.buffer,
          passwordHash: passwordData.hash,
          passwordSalt: passwordData.salt,
        });
      }

      const setting = settings.files.find(
        (file) => file.fileName === slot.fileName
      );

      if (setting) {
        setting.protected = protectedValue;
        setting.enabled = true;
        if (isKnownSemesterSlot(slotKey)) {
          setting.sgpa = sgpa;
        } else if (
          Object.prototype.hasOwnProperty.call(
            DEFAULT_PERCENTAGE,
            slotKey
          )
        ) {
          setting.percentage = percentage;
        } else {
          setting.percentage = null;
        }
      } else {
        settings.files.push({
          fileName: slot.fileName,
          protected: protectedValue,
          enabled: true,
          sgpa: isKnownSemesterSlot(slotKey) ? sgpa : null,
          percentage: Object.prototype.hasOwnProperty.call(
            DEFAULT_PERCENTAGE,
            slotKey
          )
            ? percentage
            : null,
        });
      }

      await settings.save();

      return res.status(201).json({
        success: true,
        replaced: Boolean(existing),
        message: existing
          ? `${slot.displayName} replaced successfully.`
          : `${slot.displayName} uploaded successfully.`,
        file: {
          slot: slotKey,
          fileName: slot.fileName,
          displayName: slot.displayName,
          protected: protectedValue,
          enabled: true,
          sgpa: isKnownSemesterSlot(slotKey) ? sgpa : null,
          percentage: Object.prototype.hasOwnProperty.call(
            DEFAULT_PERCENTAGE,
            slotKey
          )
            ? percentage
            : null,
          effectiveProtected:
            Boolean(settings.masterProtected) && protectedValue,
          sizeBytes: req.file.buffer.length,
          overallCgpa: calculateCgpa(settings),
        },
      });
    } catch (error) {
      console.error("PDF upload error:", error);

      if (error instanceof multer.MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({
            message: "PDF size limit is 10 MB.",
          });
        }

        return res.status(400).json({
          message: error.message,
        });
      }

      if (error?.message === "Only PDF files are allowed.") {
        return res.status(400).json({
          message: error.message,
        });
      }

      return res.status(500).json({
        message: "Unable to upload PDF.",
      });
    }
  }
);

// --------------------------------------------------
// CHANGE PASSWORD FOR ONE PDF
// --------------------------------------------------

app.patch(
  "/api/admin/security/password/:fileName",
  requireAdmin,
  async (req, res) => {
    try {
      const fileName = decodeURIComponent(req.params.fileName);
      const newPassword = String(req.body?.password || "").trim();

      if (!newPassword) {
        return res.status(400).json({
          message: "New password is required.",
        });
      }

      if (newPassword.length < 4) {
        return res.status(400).json({
          message: "Password must be at least 4 characters.",
        });
      }

      const file = await getPdfByFileName(fileName);

      if (!file) {
        return res.status(404).json({
          message: "PDF is not uploaded yet.",
        });
      }

      const passwordData = hashPassword(newPassword);
      file.passwordHash = passwordData.hash;
      file.passwordSalt = passwordData.salt;
      await file.save();

      return res.json({
        success: true,
        message: `${file.displayName} password changed successfully.`,
      });
    } catch (error) {
      console.error("Individual password change error:", error);

      return res.status(500).json({
        message: "Unable to change PDF password.",
      });
    }
  }
);

// --------------------------------------------------
// CHANGE PASSWORD FOR ALL UPLOADED PDFs
// --------------------------------------------------

app.patch(
  "/api/admin/security/password/all",
  requireAdmin,
  async (req, res) => {
    try {
      const newPassword = String(req.body?.password || "").trim();

      if (!newPassword) {
        return res.status(400).json({
          message: "New password is required.",
        });
      }

      if (newPassword.length < 4) {
        return res.status(400).json({
          message: "Password must be at least 4 characters.",
        });
      }

      const passwordData = hashPassword(newPassword);
      const files = await ProtectedPdf.find({});

      if (files.length === 0) {
        return res.status(400).json({
          message: "No uploaded PDFs found.",
        });
      }

      for (const file of files) {
        file.passwordHash = passwordData.hash;
        file.passwordSalt = passwordData.salt;
        await file.save();
      }

      return res.json({
        success: true,
        updatedCount: files.length,
        message: `Password changed for ${files.length} uploaded PDF${
          files.length === 1 ? "" : "s"
        }.`,
      });
    } catch (error) {
      console.error("All password change error:", error);

      return res.status(500).json({
        message: "Unable to change passwords for all PDFs.",
      });
    }
  }
);

// --------------------------------------------------
// ADMIN PDF DOWNLOAD
// --------------------------------------------------

function sendPdf(res, file, inline) {
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `${inline ? "inline" : "attachment"}; filename="${file.fileName}"`
  );
  res.setHeader("Cache-Control", "no-store");
  return res.send(file.data);
}

app.get(
  "/api/admin/pdf/:fileName",
  requireAdmin,
  async (req, res) => {
    try {
      const fileName = decodeURIComponent(req.params.fileName);
      const file = await getPdfByFileName(fileName);

      if (!file) {
        return res.status(404).json({
          message: "PDF is not uploaded yet.",
        });
      }

      return sendPdf(res, file, false);
    } catch (error) {
      console.error("Admin PDF download error:", error);

      return res.status(500).json({
        message: "Unable to download PDF.",
      });
    }
  }
);

// --------------------------------------------------
// ADMIN PDF PREVIEW
// --------------------------------------------------

app.get(
  "/api/admin/pdf/preview/:fileName",
  requireAdmin,
  async (req, res) => {
    try {
      const fileName = decodeURIComponent(req.params.fileName);
      const file = await getPdfByFileName(fileName);

      if (!file) {
        return res.status(404).json({
          message: "PDF is not uploaded yet.",
        });
      }

      return sendPdf(res, file, true);
    } catch (error) {
      console.error("Admin PDF preview error:", error);

      return res.status(500).json({
        message: "Unable to preview PDF.",
      });
    }
  }
);

// --------------------------------------------------
// DELETE PDF FROM SLOT
// --------------------------------------------------

app.delete(
  "/api/admin/pdf/:fileName",
  requireAdmin,
  async (req, res) => {
    try {
      const fileName = decodeURIComponent(req.params.fileName);
      const slotKey = findSlotKeyByFileName(fileName);

      if (!slotKey) {
        return res.status(404).json({
          message: "PDF slot not found.",
        });
      }

      const deleted = await ProtectedPdf.findOneAndDelete({
        fileName,
      });

      if (!deleted) {
        return res.status(404).json({
          message: "PDF is not uploaded yet.",
        });
      }

      // The fixed slot and its settings remain.
      return res.json({
        success: true,
        message: `${PDF_SLOTS[slotKey].displayName} PDF deleted successfully.`,
        slot: slotKey,
        fileName,
      });
    } catch (error) {
      console.error("PDF delete error:", error);

      return res.status(500).json({
        message: "Unable to delete PDF.",
      });
    }
  }
);

// --------------------------------------------------
// PUBLIC EDUCATION DATA
// --------------------------------------------------

app.get("/api/public/education", async (_req, res) => {
  try {
    const settings = await getPdfSecuritySettings();

    const documents = await ProtectedPdf.find(
      {},
      { fileName: 1 }
    ).lean();

    const fileSet = new Set(
      documents.map((document) => document.fileName)
    );

    const semesters = SEMESTER_SLOT_KEYS.map((slotKey) => {
      const slot = PDF_SLOTS[slotKey];
      const setting = settings.files.find(
        (item) => item.fileName === slot.fileName
      );
      const hasFile = fileSet.has(slot.fileName);

      return {
        slot: slotKey,
        name: slot.displayName,
        fileName: slot.fileName,
        sgpa:
          typeof setting?.sgpa === "number"
            ? setting.sgpa
            : null,
        enabled: setting?.enabled !== false,
        hasFile,
        available: hasFile && setting?.enabled !== false,
      };
    });

    const classMarksheets = ["classX", "classXII"].map((slotKey) => {
      const slot = PDF_SLOTS[slotKey];
      const setting = settings.files.find(
        (item) => item.fileName === slot.fileName
      );
      const hasFile = fileSet.has(slot.fileName);

      return {
        slot: slotKey,
        name: slot.displayName,
        fileName: slot.fileName,
        percentage:
          typeof setting?.percentage === "number"
            ? setting.percentage
            : null,
        enabled: setting?.enabled !== false,
        hasFile,
        available: hasFile && setting?.enabled !== false,
      };
    });

    return res.json({
      semesters,
      classMarksheets,
      overallCgpa: calculateCgpa(settings),
    });
  } catch (error) {
    console.error("Public education data error:", error);

    return res.status(500).json({
      message: "Unable to load education data.",
    });
  }
});

// --------------------------------------------------
// PUBLIC PDF STATUS
// --------------------------------------------------

app.get("/api/protected-pdf/status/:fileName", async (req, res) => {
  try {
    const fileName = decodeURIComponent(req.params.fileName);
    const file = await getPdfByFileName(fileName);

    if (!file) {
      return res.status(404).json({
        message: "PDF not found.",
      });
    }

    const settings = await getPdfSecuritySettings();
    const fileSetting = settings.files.find(
      (item) => item.fileName === fileName
    );

    const protectedNow = Boolean(
      settings.masterProtected && fileSetting?.protected
    );

    const enabledNow = fileSetting?.enabled !== false;
    const slotKey = findSlotKeyByFileName(fileName);

    return res.json({
      fileName,
      protected: protectedNow,
      enabled: enabledNow,
      available: enabledNow,
      displayName: file.displayName || fileName,
      slot: slotKey || null,
    });
  } catch (error) {
    console.error("PDF status error:", error);

    return res.status(500).json({
      message: "Unable to check PDF protection status.",
    });
  }
});

// --------------------------------------------------
// PUBLIC PDF DOWNLOAD
// --------------------------------------------------

app.post("/api/protected-pdf", async (req, res) => {
  try {
    const fileName = String(req.body?.fileName || "").trim();
    const password = String(req.body?.password || "");

    if (!fileName) {
      return res.status(400).json({
        message: "PDF file name is required.",
      });
    }

    const file = await getPdfByFileName(fileName);

    if (!file) {
      return res.status(404).json({
        message: "PDF not found.",
      });
    }

    const settings = await getPdfSecuritySettings();
    const setting = settings.files.find(
      (item) => item.fileName === fileName
    );

    if (setting?.enabled === false) {
      return res.status(404).json({
        message: "This PDF is currently disabled.",
      });
    }

    const protectedNow = await isEffectivelyProtected(fileName);

    if (protectedNow) {
      const validPassword = await verifyPdfPassword(
        file,
        password,
        fileName
      );

      if (!validPassword) {
        return res.status(401).json({
          message: "Incorrect PDF password.",
        });
      }
    }

    return sendPdf(res, file, false);
  } catch (error) {
    console.error("Protected PDF error:", error);

    return res.status(500).json({
      message: "Unable to download PDF.",
    });
  }
});

// --------------------------------------------------
// Error Handler
// --------------------------------------------------

app.use((error, _req, res, _next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        message: "PDF size limit is 10 MB.",
      });
    }

    return res.status(400).json({
      message: error.message,
    });
  }

  if (error?.message === "Only PDF files are allowed.") {
    return res.status(400).json({
      message: error.message,
    });
  }

  console.error("Unhandled server error:", error);

  return res.status(500).json({
    message: "Internal server error.",
  });
});

// --------------------------------------------------
// Start Server
// --------------------------------------------------

app.listen(PORT, () => {
  console.log(
    `Backend server running on http://localhost:${PORT}`
  );
});
