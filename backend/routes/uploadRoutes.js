import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// Ensure upload directories exist
const tradesDir = "uploads/trades";
const newsDir = "uploads/news";

[tradesDir, newsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Storage setup for Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "tradesFile") {
      cb(null, tradesDir);
    } else if (file.fieldname === "newsFile") {
      cb(null, newsDir);
    }
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

// File filter for CSV only
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext !== ".csv") {
    return cb(new Error("Only CSV files are allowed"), false);
  }
  cb(null, true);
};

const upload = multer({ storage, fileFilter });

// POST /api/upload
router.post("/", upload.fields([{ name: "tradesFile" }, { name: "newsFile" }]), (req, res) => {
  if (!req.files || (!req.files.tradesFile && !req.files.newsFile)) {
    return res.status(400).json({ message: "No files uploaded" });
  }

  res.json({
    message: "✅ Data Uploaded Successfully",
    files: req.files
  });
});

export default router;
