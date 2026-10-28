require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const crypto = require("crypto");
const { promisify } = require("util");
const scryptAsync = promisify(crypto.scrypt);
const multer = require("multer");
const { Resend } = require("resend");

const app = express();
const PORT = process.env.PORT || 5000;

// Baseline HTTP hardening for the JSON API. The frontend is hosted separately,
// so these headers do not need to permit arbitrary embedded content.
app.disable("x-powered-by");
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.setHeader("Cross-Origin-Resource-Policy", "same-site");
  next();
});

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
    allowedHeaders: ["Content-Type", "X-Admin-Password", "X-Admin-Email"],
  })
);

app.use(express.json({ limit: "1mb" }));

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
    .catch((error) =>
      console.error("MongoDB connection error:", error)
    );
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
// Portfolio Announcements
// --------------------------------------------------
const announcementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 100 },
    message: { type: String, required: true, trim: true, maxlength: 1000 },
    priority: { type: String, enum: ["normal", "important", "urgent"], default: "normal" },
    expiresAt: { type: Date, default: null },
    createdBy: { type: String, trim: true, default: "Super Admin" },
  },
  { timestamps: true }
);
announcementSchema.index({ createdAt: -1 });
const Announcement = mongoose.models.Announcement || mongoose.model("Announcement", announcementSchema);


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
  thirdSemester: 8.49,
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
    fileName: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    displayName: {
      type: String,
      required: true,
    },

    mimeType: {
      type: String,
      default: "application/pdf",
    },

    sizeBytes: {
      type: Number,
      default: 0,
    },

    data: {
      type: Buffer,
      required: true,
    },

    passwordHash: {
      type: String,
      default: "",
    },

    passwordSalt: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const ProtectedPdf = mongoose.model(
  "ProtectedPdf",
  protectedPdfSchema
);

// --------------------------------------------------
// PDF Security Settings Schema
// --------------------------------------------------

const pdfSettingSchema = new mongoose.Schema(
  {
    fileName: {
      type: String,
      required: true,
    },

    protected: {
      type: Boolean,
      default: true,
    },

    enabled: {
      type: Boolean,
      default: true,
    },

    sgpa: {
      type: Number,
      default: null,
    },

    percentage: {
      type: Number,
      default: null,
    },
  },
  { _id: false }
);

const pdfSecuritySchema = new mongoose.Schema(
  {
    masterProtected: {
      type: Boolean,
      default: true,
    },

    files: {
      type: [pdfSettingSchema],
      default: [],
    },
  },
  { timestamps: true }
);

const PdfSecurity = mongoose.model(
  "PdfSecurity",
  pdfSecuritySchema
);

// --------------------------------------------------
// ADMIN CREDENTIAL SCHEMA
// --------------------------------------------------

const adminCredentialSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      index: true,
      default: "primary",
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    passwordHash: {
      type: String,
      required: true,
    },

    passwordSalt: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const AdminCredential = mongoose.model(
  "AdminCredential",
  adminCredentialSchema
);

// --------------------------------------------------
// ADDITIONAL ADMIN USERS
// --------------------------------------------------

const adminUserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    passwordHash: {
      type: String,
      required: true,
    },

    passwordSalt: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "disabled"],
      default: "pending",
      index: true,
    },

    role: {
      type: String,
      default: "admin",
    },
  },
  { timestamps: true }
);

const AdminUser = mongoose.model("AdminUser", adminUserSchema);

// --------------------------------------------------
// ADMIN OTP SCHEMA
// --------------------------------------------------

const adminOtpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    otpHash: {
      type: String,
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },

    attempts: {
      type: Number,
      default: 0,
    },

    verified: {
      type: Boolean,
      default: false,
    },

    resetTokenHash: {
      type: String,
      default: "",
    },

    resetTokenExpiresAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

const AdminOtp = mongoose.model(
  "AdminOtp",
  adminOtpSchema
);

// --------------------------------------------------
// Password Helpers
// --------------------------------------------------

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");

  const hash = crypto
    .scryptSync(password, salt, 64)
    .toString("hex");

  return {
    hash,
    salt,
  };
}

async function verifyHashedPassword(password, hash, salt) {
  if (!hash || !salt) {
    return false;
  }

  try {
    const derived = await scryptAsync(password, salt, 64);
    const stored = Buffer.from(hash, "hex");

    return (
      stored.length === derived.length &&
      crypto.timingSafeEqual(stored, derived)
    );
  } catch (error) {
    console.error("Password verification failed:", error.message);
    return false;
  }
}

// --------------------------------------------------
// Admin Credential Helpers
// --------------------------------------------------

function normalizeEmail(email) {
  return String(email || "")
    .trim()
    .toLowerCase();
}

function getConfiguredAdminEmail() {
  return normalizeEmail(
    process.env.ADMIN_RESET_EMAIL ||
      process.env.RESEND_TO_EMAIL ||
      ""
  );
}

async function getAdminCredential() {
  let credential = await AdminCredential.findOne({
    key: "primary",
  });

  const configuredEmail = getConfiguredAdminEmail();

  // Create the MongoDB admin credential the first time.
  if (!credential) {
    const envPassword = String(
      process.env.ADMIN_PANEL_PASSWORD || ""
    );

    if (!envPassword) {
      throw new Error(
        "ADMIN_PANEL_PASSWORD is not configured."
      );
    }

    if (!configuredEmail) {
      throw new Error(
        "ADMIN_RESET_EMAIL is not configured."
      );
    }

    const passwordData = hashPassword(envPassword);

    credential = await AdminCredential.create({
      key: "primary",
      email: configuredEmail,
      passwordHash: passwordData.hash,
      passwordSalt: passwordData.salt,
    });

    console.log(
      "Admin credential migrated to MongoDB."
    );

    return credential;
  }

  // Add email to an existing credential if needed.
  if (!credential.email && configuredEmail) {
    credential.email = configuredEmail;
    await credential.save();
  }

  return credential;
}

async function verifyAdminPassword(password) {
  const credential = await getAdminCredential();

  return await verifyHashedPassword(
    password,
    credential.passwordHash,
    credential.passwordSalt
  );
}

async function authenticateAdmin(email, password) {
  const normalizedEmail = normalizeEmail(email);
  const credential = await getAdminCredential();

  if (normalizedEmail && normalizedEmail === normalizeEmail(credential.email)) {
    const valid = await verifyHashedPassword(
      password,
      credential.passwordHash,
      credential.passwordSalt
    );

    return valid
      ? { valid: true, role: "superadmin", email: credential.email, name: "Super Admin" }
      : { valid: false };
  }

  if (!normalizedEmail) {
    const valid = await verifyHashedPassword(
      password,
      credential.passwordHash,
      credential.passwordSalt
    );

    return valid
      ? { valid: true, role: "superadmin", email: credential.email, name: "Super Admin" }
      : { valid: false };
  }

  const admin = await AdminUser.findOne({ email: normalizedEmail });

  if (!admin) return { valid: false, reason: "not_found" };

  if (admin.status === "pending") return { valid: false, reason: "pending" };
  if (admin.status === "rejected") return { valid: false, reason: "rejected" };
  if (admin.status === "disabled") return { valid: false, reason: "disabled" };

  const valid = await verifyHashedPassword(
    password,
    admin.passwordHash,
    admin.passwordSalt
  );

  return valid
    ? {
        valid: true,
        role: "admin",
        email: admin.email,
        name: admin.name,
      }
    : { valid: false };
}

async function updateAdminPassword(newPassword) {
  const credential = await getAdminCredential();

  const passwordData = hashPassword(newPassword);

  credential.passwordHash = passwordData.hash;
  credential.passwordSalt = passwordData.salt;

  await credential.save();
}

// --------------------------------------------------
// OTP Helpers
// --------------------------------------------------

function getOtpHash(email, otp) {
  const secret =
    process.env.OTP_HASH_SECRET ||
    process.env.ADMIN_PANEL_PASSWORD ||
    "portfolio-admin-otp-secret";

  return crypto
    .createHash("sha256")
    .update(
      `${secret}:${normalizeEmail(email)}:${otp}`
    )
    .digest("hex");
}

function generateOtp() {
  return String(
    crypto.randomInt(100000, 1000000)
  );
}

function generateResetToken() {
  return crypto.randomBytes(32).toString("hex");
}

function hashResetToken(token) {
  return crypto
    .createHash("sha256")
    .update(String(token))
    .digest("hex");
}

// --------------------------------------------------
// Send Admin OTP Email
// --------------------------------------------------

async function sendAdminOtpEmail(email, otp) {
  if (!resend) {
    throw new Error(
      "RESEND_API_KEY is not configured."
    );
  }

  const fromEmail =
    process.env.RESEND_FROM_EMAIL ||
    "Portfolio <onboarding@resend.dev>";

  const result = await resend.emails.send({
    from: fromEmail,
    to: email,
    subject: "Admin Password Reset OTP",

    html: `
      <div style="
        font-family:Arial,sans-serif;
        max-width:600px;
        margin:0 auto;
        padding:30px;
        background:#f8fafc;
        border-radius:16px;
      ">

        <div style="
          background:#111827;
          color:white;
          padding:24px;
          border-radius:14px;
          text-align:center;
        ">
          <h2 style="margin:0 0 8px;">
            Admin Password Reset
          </h2>

          <p style="
            margin:0;
            color:#cbd5e1;
          ">
            Portfolio Admin Access
          </p>
        </div>

        <div style="padding:28px 10px;">

          <p style="
            font-size:16px;
            color:#334155;
          ">
            Use the following OTP to reset your
            administrator password:
          </p>

          <div style="
            margin:25px 0;
            padding:20px;
            background:white;
            border:2px dashed #6366f1;
            border-radius:12px;
            text-align:center;
          ">

            <div style="
              font-size:36px;
              font-weight:bold;
              letter-spacing:10px;
              color:#111827;
            ">
              ${otp}
            </div>

          </div>

          <p style="
            color:#475569;
            font-size:14px;
          ">
            This OTP is valid for 10 minutes.
          </p>

          <p style="
            color:#64748b;
            font-size:13px;
          ">
            If you did not request a password reset,
            you can safely ignore this email.
          </p>

        </div>

      </div>
    `,

    text: `
Admin Password Reset

Your OTP is: ${otp}

This OTP is valid for 10 minutes.

If you did not request a password reset,
you can safely ignore this email.
    `,
  });

  if (result?.error) {
    throw new Error(
      result.error.message ||
        "Unable to send OTP email."
    );
  }

  return result;
}

// --------------------------------------------------
// PDF Password Helpers
// --------------------------------------------------

const LEGACY_ENV_PASSWORDS = {
  "10th-marksheet.pdf":
    process.env.PDF_10TH_PASSWORD,

  "12th-marksheet.pdf":
    process.env.PDF_12TH_PASSWORD,

  "10th-Migration Certificate.pdf":
    process.env.PDF_10TH_MIGRATION_PASSWORD,

  "12th-Migration Certificate.pdf":
    process.env.PDF_MIGRATION_PASSWORD,

  "1st-semester-dmc.pdf":
    process.env.PDF_1ST_SEM_PASSWORD,

  "2nd-semester-dmc.pdf":
    process.env.PDF_2ND_SEM_PASSWORD,

  "resume.pdf":
    process.env.PDF_RESUME_PASSWORD,
};

async function verifyPdfPassword(
  file,
  password,
  fileName
) {
  if (
    await verifyHashedPassword(
      password,
      file.passwordHash,
      file.passwordSalt
    )
  ) {
    return true;
  }

  const legacyPassword =
    LEGACY_ENV_PASSWORDS[fileName];

  return Boolean(
    legacyPassword &&
      password === legacyPassword
  );
}

// --------------------------------------------------
// PDF Settings Helpers
// --------------------------------------------------

function findSlotKeyByFileName(fileName) {
  return PDF_SLOT_ORDER.find(
    (slotKey) =>
      PDF_SLOTS[slotKey].fileName === fileName
  );
}

function createDefaultSetting(slotKey) {
  return {
    fileName: PDF_SLOTS[slotKey].fileName,

    protected:
      DEFAULT_PROTECTION[slotKey] ?? true,

    enabled: true,

    sgpa:
      Object.prototype.hasOwnProperty.call(
        DEFAULT_SGPA,
        slotKey
      )
        ? DEFAULT_SGPA[slotKey]
        : null,

    percentage:
      Object.prototype.hasOwnProperty.call(
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

      files:
        PDF_SLOT_ORDER.map(
          createDefaultSetting
        ),
    });

    return settings;
  }

  const originalFiles = JSON.stringify(
    settings.files.map((item) =>
      typeof item.toObject === "function" ? item.toObject() : item
    )
  );

  const normalizedFiles =
    PDF_SLOT_ORDER.map((slotKey) => {
      const slot = PDF_SLOTS[slotKey];

      const existing =
        settings.files.find(
          (item) =>
            item.fileName === slot.fileName
        );

      if (!existing) {
        return createDefaultSetting(
          slotKey
        );
      }

      if (
        typeof existing.protected !==
        "boolean"
      ) {
        existing.protected =
          DEFAULT_PROTECTION[slotKey];
      }

      if (
        typeof existing.enabled !==
        "boolean"
      ) {
        existing.enabled = true;
      }

      if (
        SEMESTER_SLOT_KEYS.includes(
          slotKey
        ) &&
        (existing.sgpa === undefined ||
          existing.sgpa === null) &&
        DEFAULT_SGPA[slotKey] !== null
      ) {
        existing.sgpa =
          DEFAULT_SGPA[slotKey];
      }

      if (
        !SEMESTER_SLOT_KEYS.includes(
          slotKey
        )
      ) {
        existing.sgpa = null;
      }

      if (
        Object.prototype.hasOwnProperty.call(
          DEFAULT_PERCENTAGE,
          slotKey
        ) &&
        (existing.percentage ===
          undefined ||
          existing.percentage === null)
      ) {
        existing.percentage =
          DEFAULT_PERCENTAGE[slotKey];
      }

      if (
        !Object.prototype.hasOwnProperty.call(
          DEFAULT_PERCENTAGE,
          slotKey
        )
      ) {
        existing.percentage = null;
      }

      return existing;
    });

  const normalizedSnapshot = JSON.stringify(
    normalizedFiles.map((item) =>
      typeof item.toObject === "function" ? item.toObject() : item
    )
  );

  // Avoid a MongoDB write when the settings are already normalized.
  if (originalFiles !== normalizedSnapshot) {
    settings.files = normalizedFiles;
    await settings.save();
  }

  return settings;
}

async function getPdfByFileName(
  fileName
) {
  if (!PDF_FILE_NAMES.has(fileName)) {
    return null;
  }

  return ProtectedPdf.findOne({
    fileName,
  });
}

async function isEffectivelyProtected(
  fileName
) {
  const settings =
    await getPdfSecuritySettings();

  const setting =
    settings.files.find(
      (item) =>
        item.fileName === fileName
    );

  return Boolean(
    settings.masterProtected &&
      setting?.protected
  );
}

function isKnownSemesterSlot(
  slotKey
) {
  return SEMESTER_SLOT_KEYS.includes(
    slotKey
  );
}

function parseSgpa(value) {
  if (
    value === undefined ||
    value === null ||
    String(value).trim() === ""
  ) {
    return null;
  }

  const numeric = Number(value);

  if (
    !Number.isFinite(numeric) ||
    numeric < 0 ||
    numeric > 10
  ) {
    return NaN;
  }

  return (
    Math.round(numeric * 100) /
    100
  );
}

function parsePercentage(value) {
  if (
    value === undefined ||
    value === null ||
    String(value).trim() === ""
  ) {
    return null;
  }

  const numeric = Number(value);

  if (
    !Number.isFinite(numeric) ||
    numeric < 0 ||
    numeric > 100
  ) {
    return NaN;
  }

  return (
    Math.round(numeric * 100) /
    100
  );
}

function calculateCgpa(settings) {
  const values =
    settings.files
      .filter((item) =>
        SEMESTER_SLOT_KEYS.some(
          (slotKey) =>
            PDF_SLOTS[slotKey]
              .fileName ===
            item.fileName
        )
      )
      .map((item) => item.sgpa)
      .filter(
        (value) =>
          typeof value === "number" &&
          Number.isFinite(value)
      );

  if (values.length === 0) {
    return null;
  }

  const total = values.reduce(
    (sum, value) =>
      sum + value,
    0
  );

  return (
    Math.round(
      (total / values.length) *
        100
    ) / 100
  );
}

// --------------------------------------------------
// Multer
// --------------------------------------------------

const upload = multer({
  storage:
    multer.memoryStorage(),

  limits: {
    fileSize:
      10 * 1024 * 1024,
  },

  fileFilter(
    _req,
    file,
    callback
  ) {
    const isPdf =
      file.mimetype ===
        "application/pdf" ||
      file.originalname
        .toLowerCase()
        .endsWith(".pdf");

    if (!isPdf) {
      return callback(
        new Error(
          "Only PDF files are allowed."
        )
      );
    }

    callback(null, true);
  },
});

// --------------------------------------------------
// Admin Auth
// --------------------------------------------------

async function requireAdmin(req, res, next) {
  try {
    const provided = String(req.header("X-Admin-Password") || "");
    const emailHeader = normalizeEmail(req.header("X-Admin-Email") || "");

    if (!provided) {
      return res.status(401).json({
        message: "Admin password is required.",
      });
    }

    // Backward compatibility: old Super Admin sessions only sent the password.
    if (!emailHeader) {
      const valid = await verifyAdminPassword(provided);

      if (!valid) {
        return res.status(401).json({
          message: "Incorrect admin password.",
        });
      }

      req.admin = { role: "superadmin", email: (await getAdminCredential()).email };
      return next();
    }

    const auth = await authenticateAdmin(emailHeader, provided);

    if (!auth.valid) {
      return res.status(401).json({
        message: "Your admin session is no longer valid.",
      });
    }

    req.admin = auth;
    return next();
  } catch (error) {
    console.error("Admin authentication error:", error);

    return res.status(500).json({
      message: "Unable to authenticate admin.",
    });
  }
}

async function requireSuperAdmin(req, res, next) {
  try {
    const provided = String(req.header("X-Admin-Password") || "");
    const emailHeader = normalizeEmail(req.header("X-Admin-Email") || "");
    const credential = await getAdminCredential();

    if (!provided) {
      return res.status(401).json({ message: "Admin password is required." });
    }

    // Super Admin operations always require the primary credential.
    if (emailHeader && emailHeader !== normalizeEmail(credential.email)) {
      return res.status(403).json({ message: "Super Admin access is required." });
    }

    const valid = await verifyAdminPassword(provided);
    if (!valid) {
      return res.status(401).json({ message: "Incorrect Super Admin password." });
    }

    req.admin = { role: "superadmin", email: credential.email };
    return next();
  } catch (error) {
    console.error("Super Admin authentication error:", error);
    return res.status(500).json({ message: "Unable to authenticate Super Admin." });
  }
}

// --------------------------------------------------
// Announcement API
// Public visitors can read active notices. Creating requires admin access;
// deleting requires the backend-verified Super Admin credential.
// --------------------------------------------------
app.get("/api/announcements", async (_req, res) => {
  try {
    const now = new Date();
    const announcements = await Announcement.find({
      $or: [{ expiresAt: null }, { expiresAt: { $exists: false } }, { expiresAt: { $gte: now } }],
    })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return res.json({
      announcements: announcements.map((item) => ({
        id: String(item._id),
        title: item.title,
        message: item.message,
        priority: item.priority,
        createdAt: item.createdAt,
        expiresAt: item.expiresAt || "",
      })),
    });
  } catch (error) {
    console.error("Public announcements fetch error:", error);
    return res.status(500).json({ message: "Unable to load announcements." });
  }
});

app.post("/api/admin/announcements", requireAdmin, async (req, res) => {
  try {
    const title = String(req.body?.title || "").trim();
    const message = String(req.body?.message || "").trim();
    const priority = String(req.body?.priority || "normal");
    const rawExpiry = req.body?.expiresAt;

    if (!title || !message) {
      return res.status(400).json({ message: "Announcement title and message are required." });
    }
    if (title.length > 100 || message.length > 1000) {
      return res.status(400).json({ message: "Title must be 100 characters or fewer and message 1,000 characters or fewer." });
    }
    if (!["normal", "important", "urgent"].includes(priority)) {
      return res.status(400).json({ message: "Invalid announcement priority." });
    }

    let expiresAt = null;
    if (rawExpiry) {
      const parsedExpiry = new Date(rawExpiry);
      if (Number.isNaN(parsedExpiry.getTime())) {
        return res.status(400).json({ message: "Invalid announcement expiry date." });
      }
      expiresAt = parsedExpiry;
    }

    const created = await Announcement.create({
      title,
      message,
      priority,
      expiresAt,
      createdBy: req.admin?.email || "Administrator",
    });

    return res.status(201).json({
      message: "Announcement published to the portfolio.",
      announcement: {
        id: String(created._id),
        title: created.title,
        message: created.message,
        priority: created.priority,
        createdAt: created.createdAt,
        expiresAt: created.expiresAt || "",
      },
    });
  } catch (error) {
    console.error("Announcement publish error:", error);
    return res.status(500).json({ message: "Unable to publish announcement." });
  }
});

app.delete("/api/admin/announcements/:id", requireSuperAdmin, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid announcement ID." });
    }
    const deleted = await Announcement.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Announcement not found." });
    return res.json({ message: "Announcement deleted from the portfolio." });
  } catch (error) {
    console.error("Announcement delete error:", error);
    return res.status(500).json({ message: "Unable to delete announcement." });
  }
});

// --------------------------------------------------
// Home
// --------------------------------------------------

app.get("/", (_req, res) => {
  res.send(
    "Portfolio Backend is running successfully!"
  );
});

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
      } = req.body || {};

      if (
        !name ||
        !email ||
        !purpose ||
        !message
      ) {
        return res.status(400).json({
          message:
            "Please fill all required fields.",
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

      if (
        resend &&
        process.env.RESEND_TO_EMAIL
      ) {
        try {
          await resend.emails.send({
            from:
              "Portfolio <onboarding@resend.dev>",

            to:
              process.env.RESEND_TO_EMAIL,

            subject:
              `New Portfolio Message from ${name}`,

            html: `
              <div style="
                font-family:Arial,sans-serif;
                max-width:650px;
                margin:0 auto;
                padding:24px
              ">
                <h2>
                  New Portfolio Message
                </h2>

                <p>
                  <strong>Name:</strong>
                  ${name}
                </p>

                <p>
                  <strong>Email:</strong>
                  ${email}
                </p>

                <p>
                  <strong>Phone:</strong>
                  ${phone || "Not provided"}
                </p>

                <p>
                  <strong>Purpose:</strong>
                  ${purpose}
                </p>

                <p>
                  <strong>Message:</strong>
                  ${message}
                </p>
              </div>
            `,
          });
        } catch (emailError) {
          console.error(
            "Resend email error:",
            emailError
          );
        }
      }

      return res.status(201).json({
        message:
          "Message sent successfully!",

        contactId:
          newContact._id,
      });
    } catch (error) {
      console.error(
        "Contact form error:",
        error
      );

      return res.status(500).json({
        message:
          "Unable to send message.",
      });
    }
  }
);

// ==================================================
// ADMIN PASSWORD RESET - REQUEST OTP
// ==================================================

app.post(
  "/api/admin/password-reset/request",
  async (req, res) => {
    try {
      const email =
        normalizeEmail(
          req.body?.email
        );

      if (!email) {
        return res.status(400).json({
          message:
            "Admin email is required.",
        });
      }

      const credential =
        await getAdminCredential();

      if (
        email !==
        normalizeEmail(
          credential.email
        )
      ) {
        return res.status(400).json({
          message:
            "This email is not registered for admin password reset.",
        });
      }

      if (!resend) {
        return res.status(500).json({
          message:
            "Email service is not configured. Add RESEND_API_KEY to server/.env.",
        });
      }

      // Prevent repeated OTP requests.
      const recentOtp =
        await AdminOtp.findOne({
          email,
        }).sort({
          createdAt: -1,
        });

      if (
        recentOtp &&
        Date.now() -
          new Date(
            recentOtp.createdAt
          ).getTime() <
          60 * 1000
      ) {
        return res.status(429).json({
          message:
            "Please wait 60 seconds before requesting another OTP.",
        });
      }

      const otp =
        generateOtp();

      const otpHash =
        getOtpHash(
          email,
          otp
        );

      const expiresAt =
        new Date(
          Date.now() +
            10 * 60 * 1000
        );

      // Remove previous OTPs.
      await AdminOtp.deleteMany({
        email,
      });

      await AdminOtp.create({
        email,
        otpHash,
        expiresAt,
        attempts: 0,
        verified: false,
        resetTokenHash: "",
        resetTokenExpiresAt:
          null,
      });

      try {
        await sendAdminOtpEmail(
          email,
          otp
        );
      } catch (emailError) {
        await AdminOtp.deleteMany({
          email,
        });

        console.error(
          "Admin OTP email error:",
          emailError
        );

        return res.status(500).json({
          message:
            "Unable to send OTP email. Check your Resend configuration.",
        });
      }

      return res.json({
        success: true,
        message:
          "OTP sent successfully to your registered admin email.",
        expiresIn: 600,
        resendAfter: 60,
      });
    } catch (error) {
      console.error(
        "Password reset request error:",
        error
      );

      return res.status(500).json({
        message:
          "Unable to send password reset OTP.",
      });
    }
  }
);

// ==================================================
// ADMIN PASSWORD RESET - VERIFY OTP
// ==================================================

app.post(
  "/api/admin/password-reset/verify",
  async (req, res) => {
    try {
      const email =
        normalizeEmail(
          req.body?.email
        );

      const otp =
        String(
          req.body?.otp || ""
        ).trim();

      if (!email) {
        return res.status(400).json({
          message:
            "Admin email is required.",
        });
      }

      if (
        !/^\d{6}$/.test(
          otp
        )
      ) {
        return res.status(400).json({
          message:
            "Enter the 6-digit OTP received in your email.",
        });
      }

      const record =
        await AdminOtp.findOne({
          email,
        }).sort({
          createdAt: -1,
        });

      if (!record) {
        return res.status(400).json({
          message:
            "OTP not found. Please request a new OTP.",
        });
      }

      if (
        record.verified
      ) {
        return res.status(400).json({
          message:
            "This OTP has already been verified.",
        });
      }

      if (
        record.expiresAt <
        new Date()
      ) {
        await AdminOtp.deleteOne({
          _id: record._id,
        });

        return res.status(400).json({
          message:
            "OTP has expired. Please request a new OTP.",
        });
      }

      if (
        record.attempts >= 5
      ) {
        return res.status(429).json({
          message:
            "Too many incorrect OTP attempts. Please request a new OTP.",
        });
      }

      const submittedHash =
        getOtpHash(
          email,
          otp
        );

      const valid =
        crypto.timingSafeEqual(
          Buffer.from(
            submittedHash,
            "hex"
          ),
          Buffer.from(
            record.otpHash,
            "hex"
          )
        );

      if (!valid) {
        record.attempts += 1;
        await record.save();

        const remaining =
          Math.max(
            0,
            5 -
              record.attempts
          );

        return res.status(400).json({
          message:
            remaining > 0
              ? `Incorrect OTP. ${remaining} attempt${
                  remaining === 1
                    ? ""
                    : "s"
                } remaining.`
              : "Too many incorrect OTP attempts. Please request a new OTP.",
        });
      }

      const resetToken =
        generateResetToken();

      record.verified = true;

      record.resetTokenHash =
        hashResetToken(
          resetToken
        );

      record.resetTokenExpiresAt =
        new Date(
          Date.now() +
            10 * 60 * 1000
        );

      await record.save();

      return res.json({
        success: true,

        message:
          "OTP verified successfully.",

        resetToken,
        expiresIn: 600,
      });
    } catch (error) {
      console.error(
        "OTP verification error:",
        error
      );

      return res.status(500).json({
        message:
          "Unable to verify OTP.",
      });
    }
  }
);

// ==================================================
// ADMIN PASSWORD RESET - COMPLETE
// ==================================================

app.post(
  "/api/admin/password-reset/complete",
  async (req, res) => {
    try {
      const email =
        normalizeEmail(
          req.body?.email
        );

      const resetToken =
        String(
          req.body?.resetToken || ""
        ).trim();

      const newPassword =
        String(
          req.body?.newPassword || ""
        );

      const confirmPassword =
        String(
          req.body?.confirmPassword || ""
        );

      if (!email) {
        return res.status(400).json({
          message:
            "Admin email is required.",
        });
      }

      if (!resetToken) {
        return res.status(400).json({
          message:
            "Password reset verification is required.",
        });
      }

      if (
        newPassword.length < 8
      ) {
        return res.status(400).json({
          message:
            "New password must be at least 8 characters.",
        });
      }

      if (
        newPassword !==
        confirmPassword
      ) {
        return res.status(400).json({
          message:
            "Admin password confirmation does not match.",
        });
      }

      const record =
        await AdminOtp.findOne({
          email,
          verified: true,
        }).sort({
          createdAt: -1,
        });

      if (!record) {
        return res.status(400).json({
          message:
            "Password reset verification not found.",
        });
      }

      if (
        !record.resetTokenHash ||
        !record.resetTokenExpiresAt
      ) {
        return res.status(400).json({
          message:
            "Password reset token is invalid.",
        });
      }

      if (
        record.resetTokenExpiresAt <
        new Date()
      ) {
        await AdminOtp.deleteOne({
          _id: record._id,
        });

        return res.status(400).json({
          message:
            "Password reset session expired. Please start again.",
        });
      }

      const providedTokenHash =
        hashResetToken(
          resetToken
        );

      const validToken =
        crypto.timingSafeEqual(
          Buffer.from(
            providedTokenHash,
            "hex"
          ),
          Buffer.from(
            record.resetTokenHash,
            "hex"
          )
        );

      if (!validToken) {
        return res.status(400).json({
          message:
            "Invalid password reset token.",
        });
      }

      const credential =
        await getAdminCredential();

      if (
        normalizeEmail(
          credential.email
        ) !== email
      ) {
        return res.status(400).json({
          message:
            "Admin email does not match the registered account.",
        });
      }

      await updateAdminPassword(
        newPassword
      );

      await AdminOtp.deleteMany({
        email,
      });

      return res.json({
        success: true,
        message:
          "Admin password changed successfully. You can now log in with your new password.",
      });
    } catch (error) {
      console.error(
        "Password reset completion error:",
        error
      );

      return res.status(500).json({
        message:
          "Unable to change admin password.",
      });
    }
  }
);

// --------------------------------------------------
// ADMIN LOGIN
// --------------------------------------------------

app.post(
  "/api/admin/login",
  async (req, res) => {
    try {
      const email = normalizeEmail(req.body?.email || "");
      const provided = String(req.body?.password || "");

      if (!provided) {
        return res.status(401).json({
          message: "Admin password is required.",
        });
      }

      const auth = await authenticateAdmin(email, provided);

      if (!auth.valid) {
        const messages = {
          pending: "Your admin registration is pending Super Admin approval.",
          rejected: "Your admin registration was rejected.",
          disabled: "Your admin account has been disabled by the Super Admin.",
          not_found: "No admin account is registered with this email.",
        };

        return res.status(401).json({
          message: messages[auth.reason] || "Incorrect admin email or password.",
        });
      }

      return res.json({
        success: true,
        message: "Admin login successful.",
        role: auth.role,
        email: auth.email,
        name: auth.name,
      });
    } catch (error) {
      console.error("Admin login error:", error);

      return res.status(500).json({
        message: "Unable to login as admin.",
      });
    }
  }
);


// --------------------------------------------------
// Send Admin Registration Status Email
// --------------------------------------------------
async function sendAdminRegistrationStatusEmail(user, status) {
  if (!resend) throw new Error("RESEND_API_KEY is not configured.");

  const approved = status === "approved";
  const fromEmail = process.env.RESEND_FROM_EMAIL || "Portfolio <onboarding@resend.dev>";
  const title = approved ? "Admin Registration Approved" : "Admin Registration Rejected";
  const message = approved
    ? "Your administrator registration has been approved. You can now sign in using your registered email and password."
    : "Thank you for your interest in registering as an administrator. After reviewing your request, the Super Admin has rejected your registration.";

  const result = await resend.emails.send({
    from: fromEmail,
    to: user.email,
    subject: title,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:28px;background:#f8fafc;border-radius:16px;color:#0f172a">
        <div style="background:#111827;color:#fff;padding:22px;border-radius:12px;text-align:center">
          <h2 style="margin:0">${title}</h2>
        </div>
        <p>Hello ${String(user.name || "there").replace(/[&<>"']/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;", "'":"&#39;"}[c]))},</p>
        <p>${message}</p>
        <p style="color:#475569;font-size:13px">This is an automated message. Please do not share your password with anyone.</p>
      </div>
    `,
  });
  if (result?.error) throw new Error(result.error.message || "Email provider rejected the message.");
  return result;
}

// --------------------------------------------------
// ADMIN REGISTRATION & SUPER ADMIN MANAGEMENT
// --------------------------------------------------

app.post("/api/admin/register", async (req, res) => {
  try {
    const name = String(req.body?.name || "").trim();
    const email = normalizeEmail(req.body?.email || "");
    const password = String(req.body?.password || "");
    const confirmPassword = String(req.body?.confirmPassword || "");

    if (!name || name.length < 2) {
      return res.status(400).json({ message: "Please enter your full name." });
    }

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ message: "Please enter a valid email address." });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters." });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Password and confirm password do not match." });
    }

    const primary = await getAdminCredential();
    if (email === normalizeEmail(primary.email)) {
      return res.status(400).json({ message: "This email belongs to the Super Admin." });
    }

    const existing = await AdminUser.findOne({ email });
    if (existing) {
      if (existing.status === "rejected") {
        const passwordData = hashPassword(password);
        existing.name = name;
        existing.passwordHash = passwordData.hash;
        existing.passwordSalt = passwordData.salt;
        existing.status = "pending";
        await existing.save();

        return res.status(201).json({
          success: true,
          message: "Registration submitted again. Please wait for Super Admin approval.",
        });
      }

      return res.status(409).json({
        message: "An admin registration already exists for this email address.",
      });
    }

    const passwordData = hashPassword(password);
    await AdminUser.create({
      name,
      email,
      passwordHash: passwordData.hash,
      passwordSalt: passwordData.salt,
      status: "pending",
      role: "admin",
    });

    return res.status(201).json({
      success: true,
      message: "Registration submitted successfully. Wait for Super Admin approval before logging in.",
    });
  } catch (error) {
    console.error("Admin registration error:", error);
    return res.status(500).json({ message: "Unable to submit admin registration." });
  }
});

app.get("/api/admin/requests", requireSuperAdmin, async (_req, res) => {
  try {
    const requests = await AdminUser.find({ status: "pending" })
      .select("name email status createdAt")
      .sort({ createdAt: -1 })
      .lean();

    return res.json({ success: true, requests });
  } catch (error) {
    console.error("Admin request list error:", error);
    return res.status(500).json({ message: "Unable to load admin requests." });
  }
});

app.get("/api/admin/users", requireSuperAdmin, async (_req, res) => {
  try {
    const users = await AdminUser.find({ status: { $in: ["approved", "disabled"] } })
      .select("name email status role createdAt updatedAt")
      .sort({ createdAt: -1 })
      .lean();

    return res.json({ success: true, users });
  } catch (error) {
    console.error("Admin user list error:", error);
    return res.status(500).json({ message: "Unable to load registered admins." });
  }
});

app.post("/api/admin/requests/:id/approve", requireSuperAdmin, async (req, res) => {
  try {
    const user = await AdminUser.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "Admin request not found." });

    user.status = "approved";
    await user.save();

    try {
      await sendAdminRegistrationStatusEmail(user, "approved");
      return res.json({ success: true, emailSent: true, message: `${user.email} has been approved and a confirmation email was sent.` });
    } catch (emailError) {
      console.error("Admin approval email error:", emailError);
      return res.json({ success: true, emailSent: false, message: `${user.email} has been approved, but the confirmation email could not be sent. Check RESEND_API_KEY and RESEND_FROM_EMAIL.` });
    }
  } catch (error) {
    console.error("Admin approval error:", error);
    return res.status(500).json({ message: "Unable to approve admin request." });
  }
});

app.post("/api/admin/requests/:id/reject", requireSuperAdmin, async (req, res) => {
  try {
    const user = await AdminUser.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "Admin request not found." });

    user.status = "rejected";
    await user.save();

    try {
      await sendAdminRegistrationStatusEmail(user, "rejected");
      return res.json({ success: true, emailSent: true, message: `${user.email} has been rejected and a notification email was sent.` });
    } catch (emailError) {
      console.error("Admin rejection email error:", emailError);
      return res.json({ success: true, emailSent: false, message: `${user.email} has been rejected, but the notification email could not be sent. Check RESEND_API_KEY and RESEND_FROM_EMAIL.` });
    }
  } catch (error) {
    console.error("Admin rejection error:", error);
    return res.status(500).json({ message: "Unable to reject admin request." });
  }
});

app.post("/api/admin/users/:id/disable", requireSuperAdmin, async (req, res) => {
  try {
    const user = await AdminUser.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "Admin user not found." });

    user.status = "disabled";
    await user.save();

    return res.json({ success: true, message: `${user.email} has been disabled.` });
  } catch (error) {
    console.error("Admin disable error:", error);
    return res.status(500).json({ message: "Unable to disable admin user." });
  }
});

app.post("/api/admin/users/:id/enable", requireSuperAdmin, async (req, res) => {
  try {
    const user = await AdminUser.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "Admin user not found." });

    user.status = "approved";
    await user.save();

    return res.json({ success: true, message: `${user.email} has been enabled.` });
  } catch (error) {
    console.error("Admin enable error:", error);
    return res.status(500).json({ message: "Unable to enable admin user." });
  }
});

app.delete("/api/admin/users/:id", requireSuperAdmin, async (req, res) => {
  try {
    const user = await AdminUser.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "Admin user not found." });

    await AdminUser.deleteOne({ _id: user._id });
    return res.json({ success: true, message: `${user.email} has been deleted.` });
  } catch (error) {
    console.error("Admin delete error:", error);
    return res.status(500).json({ message: "Unable to delete admin user." });
  }
});

// --------------------------------------------------
// ADMIN SECURITY - READ
// --------------------------------------------------

app.get(
  "/api/admin/security",
  requireAdmin,
  async (_req, res) => {
    try {
      const settings =
        await getPdfSecuritySettings();

      const documents =
        await ProtectedPdf.find(
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

      const documentMap =
        new Map(
          documents.map(
            (document) => [
              document.fileName,
              document,
            ]
          )
        );

      const files =
        PDF_SLOT_ORDER.map(
          (slotKey) => {
            const slot =
              PDF_SLOTS[
                slotKey
              ];

            const setting =
              settings.files.find(
                (file) =>
                  file.fileName ===
                  slot.fileName
              );

            const document =
              documentMap.get(
                slot.fileName
              );

            return {
              slot: slotKey,

              fileName:
                slot.fileName,

              displayName:
                slot.displayName,

              isSemester:
                isKnownSemesterSlot(
                  slotKey
                ),

              protected:
                Boolean(
                  setting?.protected
                ),

              enabled:
                setting?.enabled !==
                false,

              effectiveProtected:
                Boolean(
                  settings.masterProtected &&
                    setting?.protected
                ),

              sgpa:
                typeof setting?.sgpa ===
                "number"
                  ? setting.sgpa
                  : null,

              sizeBytes:
                document?.sizeBytes ||
                0,

              uploadedAt:
                document?.updatedAt ||
                document?.createdAt ||
                null,

              builtIn: true,

              hasFile:
                Boolean(document),

              available:
                Boolean(
                  document &&
                    setting?.enabled !==
                      false
                ),
            };
          }
        );

      return res.json({
        masterProtected:
          Boolean(
            settings.masterProtected
          ),

        files,

        overallCgpa:
          calculateCgpa(
            settings
          ),
      });
    } catch (error) {
      console.error(
        "Admin security read error:",
        error
      );

      return res.status(500).json({
        message:
          "Unable to load PDF security settings.",
      });
    }
  }
);

// --------------------------------------------------
// MASTER PROTECTION
// --------------------------------------------------

app.patch(
  "/api/admin/security/master",
  requireAdmin,
  async (req, res) => {
    try {
      const settings =
        await getPdfSecuritySettings();

      settings.masterProtected =
        Boolean(
          req.body?.protected
        );

      await settings.save();

      return res.json({
        success: true,

        masterProtected:
          settings.masterProtected,

        message:
          settings.masterProtected
            ? "Password protection enabled for all PDFs."
            : "Password protection disabled for all PDFs.",
      });
    } catch (error) {
      console.error(
        "Master protection error:",
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
// INDIVIDUAL PROTECTION
// --------------------------------------------------

app.patch(
  "/api/admin/security/pdf/:fileName",
  requireAdmin,
  async (req, res) => {
    try {
      const fileName =
        decodeURIComponent(
          req.params.fileName
        );

      const settings =
        await getPdfSecuritySettings();

      const target =
        settings.files.find(
          (file) =>
            file.fileName ===
            fileName
        );

      if (!target) {
        return res.status(404).json({
          message:
            "PDF slot not found.",
        });
      }

      target.protected =
        Boolean(
          req.body?.protected
        );

      await settings.save();

      const slotKey =
        findSlotKeyByFileName(
          fileName
        );

      return res.json({
        success: true,

        fileName,

        protected:
          target.protected,

        message: `${
          slotKey
            ? PDF_SLOTS[
                slotKey
              ].displayName
            : fileName
        } protection ${
          target.protected
            ? "enabled"
            : "disabled"
        }.`,
      });
    } catch (error) {
      console.error(
        "Individual protection error:",
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
// ENABLE / DISABLE PORTFOLIO SLOT
// --------------------------------------------------

app.patch(
  "/api/admin/security/slot/:slotKey/enabled",
  requireAdmin,
  async (req, res) => {
    try {
      const slotKey =
        String(
          req.params.slotKey ||
            ""
        );

      const slot =
        PDF_SLOTS[slotKey];

      if (!slot) {
        return res.status(404).json({
          message:
            "PDF slot not found.",
        });
      }

      const settings =
        await getPdfSecuritySettings();

      const target =
        settings.files.find(
          (file) =>
            file.fileName ===
            slot.fileName
        );

      if (!target) {
        return res.status(404).json({
          message:
            "PDF slot setting not found.",
        });
      }

      target.enabled =
        Boolean(
          req.body?.enabled
        );

      await settings.save();

      return res.json({
        success: true,

        slot: slotKey,

        enabled:
          target.enabled,

        available:
          target.enabled &&
          Boolean(
            await getPdfByFileName(
              slot.fileName
            )
          ),

        message: `${slot.displayName} is now ${
          target.enabled
            ? "enabled"
            : "disabled"
        } in the portfolio.`,
      });
    } catch (error) {
      console.error(
        "Slot enable/disable error:",
        error
      );

      return res.status(500).json({
        message:
          "Unable to update PDF slot status.",
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
      const slotKey =
        String(
          req.params.slotKey ||
            ""
        );

      if (
        !isKnownSemesterSlot(
          slotKey
        )
      ) {
        return res.status(400).json({
          message:
            "SGPA can only be updated for semester slots.",
        });
      }

      const parsed =
        parseSgpa(
          req.body?.sgpa
        );

      if (
        parsed === null ||
        Number.isNaN(parsed)
      ) {
        return res.status(400).json({
          message:
            "Enter a valid SGPA between 0 and 10.",
        });
      }

      const settings =
        await getPdfSecuritySettings();

      const fileName =
        PDF_SLOTS[
          slotKey
        ].fileName;

      const target =
        settings.files.find(
          (file) =>
            file.fileName ===
            fileName
        );

      if (!target) {
        return res.status(404).json({
          message:
            "PDF slot setting not found.",
        });
      }

      target.sgpa = parsed;

      await settings.save();

      return res.json({
        success: true,

        slot: slotKey,

        sgpa: parsed,

        overallCgpa:
          calculateCgpa(
            settings
          ),

        message: `${PDF_SLOTS[slotKey].displayName} SGPA saved as ${parsed}.`,
      });
    } catch (error) {
      console.error(
        "SGPA update error:",
        error
      );

      return res.status(500).json({
        message:
          "Unable to update SGPA.",
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
      const slotKey =
        String(
          req.params.slotKey ||
            ""
        );

      if (
        !Object.prototype.hasOwnProperty.call(
          DEFAULT_PERCENTAGE,
          slotKey
        )
      ) {
        return res.status(400).json({
          message:
            "Percentage can only be updated for Class X or Class XII.",
        });
      }

      const parsed =
        parsePercentage(
          req.body?.percentage
        );

      if (
        parsed === null ||
        Number.isNaN(parsed)
      ) {
        return res.status(400).json({
          message:
            "Enter a valid percentage between 0 and 100.",
        });
      }

      const settings =
        await getPdfSecuritySettings();

      const fileName =
        PDF_SLOTS[
          slotKey
        ].fileName;

      const target =
        settings.files.find(
          (file) =>
            file.fileName ===
            fileName
        );

      if (!target) {
        return res.status(404).json({
          message:
            "PDF slot setting not found.",
        });
      }

      target.percentage =
        parsed;

      await settings.save();

      return res.json({
        success: true,

        slot: slotKey,

        percentage: parsed,

        message: `${PDF_SLOTS[slotKey].displayName} percentage saved as ${parsed}%.`,
      });
    } catch (error) {
      console.error(
        "Percentage update error:",
        error
      );

      return res.status(500).json({
        message:
          "Unable to update percentage.",
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
          message:
            "Please select a PDF file.",
        });
      }

      const slotKey =
        String(
          req.body?.slot || ""
        ).trim();

      const slot =
        PDF_SLOTS[slotKey];

      if (!slot) {
        return res.status(400).json({
          message:
            "Please select a valid PDF slot.",
        });
      }

      const protectedValue =
        String(
          req.body?.protected
        ) !== "false";

      const uploadPassword =
        String(
          req.body?.password ||
            ""
        );

      if (
        protectedValue &&
        !uploadPassword.trim()
      ) {
        return res.status(400).json({
          message:
            "Password is required when protection is ON.",
        });
      }

      const settings =
        await getPdfSecuritySettings();

      const existingSetting =
        settings.files.find(
          (file) =>
            file.fileName ===
            slot.fileName
        );

      let sgpa =
        existingSetting?.sgpa ??
        null;

      let percentage =
        existingSetting?.percentage ??
        null;

      if (
        Object.prototype.hasOwnProperty.call(
          DEFAULT_PERCENTAGE,
          slotKey
        )
      ) {
        const submittedPercentage =
          parsePercentage(
            req.body?.percentage
          );

        if (
          submittedPercentage !==
          null
        ) {
          if (
            Number.isNaN(
              submittedPercentage
            )
          ) {
            return res.status(400).json({
              message:
                "Percentage must be between 0 and 100.",
            });
          }

          percentage =
            submittedPercentage;
        }

        if (
          percentage === null
        ) {
          percentage =
            DEFAULT_PERCENTAGE[
              slotKey
            ];
        }
      }

      if (
        isKnownSemesterSlot(
          slotKey
        )
      ) {
        const submittedSgpa =
          parseSgpa(
            req.body?.sgpa
          );

        if (
          submittedSgpa !==
          null
        ) {
          if (
            Number.isNaN(
              submittedSgpa
            )
          ) {
            return res.status(400).json({
              message:
                "SGPA must be between 0 and 10.",
            });
          }

          sgpa =
            submittedSgpa;
        }

        if (sgpa === null) {
          return res.status(400).json({
            message: `${slot.displayName} requires an SGPA between 0 and 10.`,
          });
        }
      }

      const passwordData =
        protectedValue
          ? hashPassword(
              uploadPassword
            )
          : {
              hash: "",
              salt: "",
            };

      const existing =
        await ProtectedPdf.findOne({
          fileName:
            slot.fileName,
        });

      if (existing) {
        existing.displayName =
          slot.displayName;

        existing.mimeType =
          "application/pdf";

        existing.sizeBytes =
          req.file.buffer.length;

        existing.data =
          req.file.buffer;

        existing.passwordHash =
          passwordData.hash;

        existing.passwordSalt =
          passwordData.salt;

        await existing.save();
      } else {
        await ProtectedPdf.create({
          fileName:
            slot.fileName,

          displayName:
            slot.displayName,

          mimeType:
            "application/pdf",

          sizeBytes:
            req.file.buffer.length,

          data:
            req.file.buffer,

          passwordHash:
            passwordData.hash,

          passwordSalt:
            passwordData.salt,
        });
      }

      const setting =
        settings.files.find(
          (file) =>
            file.fileName ===
            slot.fileName
        );

      if (setting) {
        setting.protected =
          protectedValue;

        setting.enabled =
          true;

        if (
          isKnownSemesterSlot(
            slotKey
          )
        ) {
          setting.sgpa =
            sgpa;
        } else if (
          Object.prototype.hasOwnProperty.call(
            DEFAULT_PERCENTAGE,
            slotKey
          )
        ) {
          setting.percentage =
            percentage;
        } else {
          setting.percentage =
            null;
        }
      } else {
        settings.files.push({
          fileName:
            slot.fileName,

          protected:
            protectedValue,

          enabled: true,

          sgpa:
            isKnownSemesterSlot(
              slotKey
            )
              ? sgpa
              : null,

          percentage:
            Object.prototype.hasOwnProperty.call(
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

        replaced:
          Boolean(existing),

        message:
          existing
            ? `${slot.displayName} replaced successfully.`
            : `${slot.displayName} uploaded successfully.`,

        file: {
          slot: slotKey,

          fileName:
            slot.fileName,

          displayName:
            slot.displayName,

          protected:
            protectedValue,

          enabled: true,

          sgpa:
            isKnownSemesterSlot(
              slotKey
            )
              ? sgpa
              : null,

          percentage:
            Object.prototype.hasOwnProperty.call(
              DEFAULT_PERCENTAGE,
              slotKey
            )
              ? percentage
              : null,

          effectiveProtected:
            Boolean(
              settings.masterProtected
            ) &&
            protectedValue,

          sizeBytes:
            req.file.buffer.length,

          overallCgpa:
            calculateCgpa(
              settings
            ),
        },
      });
    } catch (error) {
      console.error(
        "PDF upload error:",
        error
      );

      if (
        error instanceof
        multer.MulterError
      ) {
        if (
          error.code ===
          "LIMIT_FILE_SIZE"
        ) {
          return res.status(400).json({
            message:
              "PDF size limit is 10 MB.",
          });
        }

        return res.status(400).json({
          message:
            error.message,
        });
      }

      if (
        error?.message ===
        "Only PDF files are allowed."
      ) {
        return res.status(400).json({
          message:
            error.message,
        });
      }

      return res.status(500).json({
        message:
          "Unable to upload PDF.",
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
      const fileName =
        decodeURIComponent(
          req.params.fileName
        );

      const newPassword =
        String(
          req.body?.password ||
            ""
        ).trim();

      if (!newPassword) {
        return res.status(400).json({
          message:
            "New password is required.",
        });
      }

      if (
        newPassword.length < 4
      ) {
        return res.status(400).json({
          message:
            "Password must be at least 4 characters.",
        });
      }

      const file =
        await getPdfByFileName(
          fileName
        );

      if (!file) {
        return res.status(404).json({
          message:
            "PDF is not uploaded yet.",
        });
      }

      const passwordData =
        hashPassword(
          newPassword
        );

      file.passwordHash =
        passwordData.hash;

      file.passwordSalt =
        passwordData.salt;

      await file.save();

      return res.json({
        success: true,

        message: `${file.displayName} password changed successfully.`,
      });
    } catch (error) {
      console.error(
        "Individual password change error:",
        error
      );

      return res.status(500).json({
        message:
          "Unable to change PDF password.",
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
      const newPassword =
        String(
          req.body?.password ||
            ""
        ).trim();

      if (!newPassword) {
        return res.status(400).json({
          message:
            "New password is required.",
        });
      }

      if (
        newPassword.length < 4
      ) {
        return res.status(400).json({
          message:
            "Password must be at least 4 characters.",
        });
      }

      const passwordData =
        hashPassword(
          newPassword
        );

      const files =
        await ProtectedPdf.find(
          {}
        );

      if (files.length === 0) {
        return res.status(400).json({
          message:
            "No uploaded PDFs found.",
        });
      }

      for (
        const file of files
      ) {
        file.passwordHash =
          passwordData.hash;

        file.passwordSalt =
          passwordData.salt;

        await file.save();
      }

      return res.json({
        success: true,

        updatedCount:
          files.length,

        message:
          `Password changed for ${files.length} uploaded PDF${
            files.length === 1
              ? ""
              : "s"
          }.`,
      });
    } catch (error) {
      console.error(
        "All password change error:",
        error
      );

      return res.status(500).json({
        message:
          "Unable to change passwords for all PDFs.",
      });
    }
  }
);

// --------------------------------------------------
// ADMIN PDF DOWNLOAD
// --------------------------------------------------

function sendPdf(
  res,
  file,
  inline
) {
  res.setHeader(
    "Content-Type",
    "application/pdf"
  );

  res.setHeader(
    "Content-Disposition",
    `${
      inline
        ? "inline"
        : "attachment"
    }; filename="${file.fileName}"`
  );

  res.setHeader(
    "Cache-Control",
    "no-store"
  );

  return res.send(
    file.data
  );
}

app.get(
  "/api/admin/pdf/:fileName",
  requireAdmin,
  async (req, res) => {
    try {
      const fileName =
        decodeURIComponent(
          req.params.fileName
        );

      const file =
        await getPdfByFileName(
          fileName
        );

      if (!file) {
        return res.status(404).json({
          message:
            "PDF is not uploaded yet.",
        });
      }

      return sendPdf(
        res,
        file,
        false
      );
    } catch (error) {
      console.error(
        "Admin PDF download error:",
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
// ADMIN PDF PREVIEW
// --------------------------------------------------

app.get(
  "/api/admin/pdf/preview/:fileName",
  requireAdmin,
  async (req, res) => {
    try {
      const fileName =
        decodeURIComponent(
          req.params.fileName
        );

      const file =
        await getPdfByFileName(
          fileName
        );

      if (!file) {
        return res.status(404).json({
          message:
            "PDF is not uploaded yet.",
        });
      }

      return sendPdf(
        res,
        file,
        true
      );
    } catch (error) {
      console.error(
        "Admin PDF preview error:",
        error
      );

      return res.status(500).json({
        message:
          "Unable to preview PDF.",
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
      const fileName =
        decodeURIComponent(
          req.params.fileName
        );

      const slotKey =
        findSlotKeyByFileName(
          fileName
        );

      if (!slotKey) {
        return res.status(404).json({
          message:
            "PDF slot not found.",
        });
      }

      const deleted =
        await ProtectedPdf.findOneAndDelete(
          {
            fileName,
          }
        );

      if (!deleted) {
        return res.status(404).json({
          message:
            "PDF is not uploaded yet.",
        });
      }

      return res.json({
        success: true,

        message: `${PDF_SLOTS[slotKey].displayName} PDF deleted successfully.`,

        slot: slotKey,

        fileName,
      });
    } catch (error) {
      console.error(
        "PDF delete error:",
        error
      );

      return res.status(500).json({
        message:
          "Unable to delete PDF.",
      });
    }
  }
);

// --------------------------------------------------
// PUBLIC EDUCATION DATA
// --------------------------------------------------

app.get(
  "/api/public/education",
  async (_req, res) => {
    try {
      const settings =
        await getPdfSecuritySettings();

      const documents =
        await ProtectedPdf.find(
          {},
          {
            fileName: 1,
          }
        ).lean();

      const fileSet =
        new Set(
          documents.map(
            (document) =>
              document.fileName
          )
        );

      const semesters =
        SEMESTER_SLOT_KEYS.map(
          (slotKey) => {
            const slot =
              PDF_SLOTS[
                slotKey
              ];

            const setting =
              settings.files.find(
                (item) =>
                  item.fileName ===
                  slot.fileName
              );

            const hasFile =
              fileSet.has(
                slot.fileName
              );

            return {
              slot: slotKey,

              name:
                slot.displayName,

              fileName:
                slot.fileName,

              sgpa:
                typeof setting?.sgpa ===
                "number"
                  ? setting.sgpa
                  : null,

              enabled:
                setting?.enabled !==
                false,

              hasFile,

              available:
                hasFile &&
                setting?.enabled !==
                  false,
            };
          }
        );

      const classMarksheets =
        [
          "classX",
          "classXII",
        ].map(
          (slotKey) => {
            const slot =
              PDF_SLOTS[
                slotKey
              ];

            const setting =
              settings.files.find(
                (item) =>
                  item.fileName ===
                  slot.fileName
              );

            const hasFile =
              fileSet.has(
                slot.fileName
              );

            return {
              slot: slotKey,

              name:
                slot.displayName,

              fileName:
                slot.fileName,

              percentage:
                typeof setting?.percentage ===
                "number"
                  ? setting.percentage
                  : null,

              enabled:
                setting?.enabled !==
                false,

              hasFile,

              available:
                hasFile &&
                setting?.enabled !==
                  false,
            };
          }
        );

      // The Education frontend expects these two top-level percentage fields.
      // Derive them from the same settings used by the admin panel so saved
      // percentages are displayed publicly instead of always falling back.
      const class10Percentage =
        classMarksheets.find(
          (item) => item.slot === "classX"
        )?.percentage ?? DEFAULT_PERCENTAGE.classX;

      const class12Percentage =
        classMarksheets.find(
          (item) => item.slot === "classXII"
        )?.percentage ?? DEFAULT_PERCENTAGE.classXII;

      return res.json({
        semesters,
        classMarksheets,
        class10Percentage,
        class12Percentage,
        overallCgpa: calculateCgpa(settings),
      });
    } catch (error) {
      console.error(
        "Public education data error:",
        error
      );

      return res.status(500).json({
        message:
          "Unable to load education data.",
      });
    }
  }
);

// --------------------------------------------------
// PUBLIC PDF STATUS
// --------------------------------------------------

app.get(
  "/api/protected-pdf/status/:fileName",
  async (req, res) => {
    try {
      const fileName =
        decodeURIComponent(
          req.params.fileName
        );

      const file =
        await getPdfByFileName(
          fileName
        );

      if (!file) {
        return res.status(404).json({
          message:
            "PDF not found.",
        });
      }

      const settings =
        await getPdfSecuritySettings();

      const fileSetting =
        settings.files.find(
          (item) =>
            item.fileName ===
            fileName
        );

      const protectedNow =
        Boolean(
          settings.masterProtected &&
            fileSetting?.protected
        );

      const enabledNow =
        fileSetting?.enabled !==
        false;

      const slotKey =
        findSlotKeyByFileName(
          fileName
        );

      return res.json({
        fileName,

        protected:
          protectedNow,

        enabled:
          enabledNow,

        available:
          enabledNow,

        displayName:
          file.displayName ||
          fileName,

        slot:
          slotKey || null,
      });
    } catch (error) {
      console.error(
        "PDF status error:",
        error
      );

      return res.status(500).json({
        message:
          "Unable to check PDF protection status.",
      });
    }
  }
);

// --------------------------------------------------
// PUBLIC PDF DOWNLOAD
// --------------------------------------------------

app.post(
  "/api/protected-pdf",
  async (req, res) => {
    try {
      const fileName =
        String(
          req.body?.fileName ||
            ""
        ).trim();

      const password =
        String(
          req.body?.password ||
            ""
        );

      if (!fileName) {
        return res.status(400).json({
          message:
            "PDF file name is required.",
        });
      }

      const file =
        await getPdfByFileName(
          fileName
        );

      if (!file) {
        return res.status(404).json({
          message:
            "PDF not found.",
        });
      }

      const settings =
        await getPdfSecuritySettings();

      const setting =
        settings.files.find(
          (item) =>
            item.fileName ===
            fileName
        );

      if (
        setting?.enabled ===
        false
      ) {
        return res.status(404).json({
          message:
            "This PDF is currently disabled.",
        });
      }

      const protectedNow =
        await isEffectivelyProtected(
          fileName
        );

      if (protectedNow) {
        const validPassword =
          await verifyPdfPassword(
            file,
            password,
            fileName
          );

        if (!validPassword) {
          return res.status(401).json({
            message:
              "Incorrect PDF password.",
          });
        }
      }

      return sendPdf(
        res,
        file,
        false
      );
    } catch (error) {
      console.error(
        "Protected PDF error:",
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
// Error Handler
// --------------------------------------------------

app.use(
  (
    error,
    _req,
    res,
    _next
  ) => {
    if (
      error instanceof
      multer.MulterError
    ) {
      if (
        error.code ===
        "LIMIT_FILE_SIZE"
      ) {
        return res.status(400).json({
          message:
            "PDF size limit is 10 MB.",
        });
      }

      return res.status(400).json({
        message:
          error.message,
      });
    }

    if (
      error?.message ===
      "Only PDF files are allowed."
    ) {
      return res.status(400).json({
        message:
          error.message,
      });
    }

    console.error(
      "Unhandled server error:",
      error
    );

    return res.status(500).json({
      message:
        "Internal server error.",
    });
  }
);

// --------------------------------------------------
// Start Server
// --------------------------------------------------

app.listen(
  PORT,
  () => {
    console.log(
      `Backend server running on http://localhost:${PORT}`
    );
  }
);


