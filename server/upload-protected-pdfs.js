require("dotenv").config();

const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  console.error("❌ MONGODB_URI is missing in .env");
  process.exit(1);
}

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

const ProtectedPdf = mongoose.model("ProtectedPdf", protectedPdfSchema);

const protectedPdfFolder = path.join(__dirname, "protected-pdfs");

const pdfFiles = [
  "10th-marksheet.pdf",
  "12th-marksheet.pdf",
  "1st-semester-dmc.pdf",
  "2nd-semester-dmc.pdf",
  "resume.pdf",
];

async function uploadProtectedPdfs() {
  try {
    await mongoose.connect(mongoUri);
    console.log("✅ MongoDB connected successfully!");

    for (const fileName of pdfFiles) {
      const filePath = path.join(protectedPdfFolder, fileName);

      if (!fs.existsSync(filePath)) {
        console.log(`❌ File not found: ${fileName}`);
        continue;
      }

      const fileBuffer = fs.readFileSync(filePath);

      await ProtectedPdf.findOneAndUpdate(
        { fileName },
        {
          fileName,
          contentType: "application/pdf",
          size: fileBuffer.length,
          data: fileBuffer,
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        }
      );

      console.log(
        `✅ Uploaded: ${fileName} (${fileBuffer.length} bytes)`
      );
    }

    console.log("🎉 All available protected PDFs uploaded to MongoDB.");
  } catch (error) {
    console.error("❌ Upload failed:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 MongoDB connection closed.");
  }
}

uploadProtectedPdfs();