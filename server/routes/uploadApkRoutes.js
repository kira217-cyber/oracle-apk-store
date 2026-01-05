// backend/routes/uploadApkRoutes.js
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import UploadApk from "../models/UploadApk.js";

const router = express.Router();

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads");

    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

// File filter: allow images, videos, and .apk files
const fileFilter = (req, file, cb) => {
  const fieldName = file.fieldname;

  let allowed = false;

  if (fieldName === "apkFile") {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === ".apk") {
      allowed = true;
    }
  } else if (fieldName === "apkLogo" || fieldName === "screenshots") {
    const imageTypes = /jpeg|jpg|png|gif|webp/;
    const extname = imageTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = imageTypes.test(file.mimetype);
    allowed = extname && mimetype;
  } else if (fieldName === "uploadVideo") {
    const videoTypes = /mp4|avi|mov|mkv|webm/;
    const extname = videoTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = videoTypes.test(file.mimetype);
    allowed = extname && mimetype;
  }

  if (allowed) {
    cb(null, true);
  } else {
    const message =
      fieldName === "apkFile"
        ? "Only .apk files are allowed!"
        : fieldName === "uploadVideo"
        ? "Only video files (mp4, avi, mov, mkv, webm) are allowed!"
        : "Only image files (jpeg, jpg, png, gif, webp) are allowed!";
    cb(new Error(message), false);
  }
};

// Multer config
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB per file
});

// POST: Upload APK
router.post(
  "/upload-apk",
  upload.fields([
    { name: "apkLogo", maxCount: 1 },
    { name: "uploadVideo", maxCount: 1 },
    { name: "apkFile", maxCount: 1 },
    { name: "screenshots", maxCount: 12 },
  ]),
  async (req, res) => {
    try {
      const data = { ...req.body };

      // CRITICAL FIX: Get user ID from form data sent by frontend
      const userIdFromFrontend = data.user;

      if (!userIdFromFrontend) {
        return res.status(401).json({
          error: "User not authenticated. Please log in.",
        });
      }

      // Assign the user ID from frontend
      data.user = userIdFromFrontend;

      // Parse JSON-stringified arrays
      const arrayFields = [
        "tags",
        "childDataTypes",
        "purposeOfDataCollection",
        "dataSharedWith",
        "dataProtection",
        "dataRetention",
        "userControls",
        "childCompliance",
        "sensitivePermissions",
        "adDetails",
        "declarations",
      ];

      arrayFields.forEach((field) => {
        if (data[field]) {
          try {
            data[field] = JSON.parse(data[field]);
          } catch (err) {
            return res.status(400).json({
              error: `Invalid JSON format for ${field}`,
            });
          }
        } else {
          data[field] = [];
        }
      });

      // Map uploaded file paths
      data.apkLogo = req.files["apkLogo"]
        ? `/uploads/${req.files["apkLogo"][0].filename}`
        : null;

      data.uploadVideo = req.files["uploadVideo"]
        ? `/uploads/${req.files["uploadVideo"][0].filename}`
        : null;

      data.apkFile = req.files["apkFile"]
        ? `/uploads/${req.files["apkFile"][0].filename}`
        : null;

      data.screenshots = req.files["screenshots"]
        ? req.files["screenshots"].map((file) => `/uploads/${file.filename}`)
        : [];

      // Server-side validation
      if (!data.apkLogo) {
        return res.status(400).json({ error: "APK Logo is required" });
      }
      if (!data.apkFile) {
        return res.status(400).json({ error: "APK File is required" });
      }
      if (data.screenshots.length < 4 || data.screenshots.length > 12) {
        return res.status(400).json({
          error: "Must upload between 4 and 12 screenshots",
        });
      }
      if (data.tags.length < 5) {
        return res.status(400).json({ error: "Minimum 5 tags required" });
      }
      if (data.declarations.length !== 4) {
        return res.status(400).json({
          error: "All 4 declarations must be checked",
        });
      }

      // Save to database
      const newUpload = new UploadApk(data);
      await newUpload.save();

      res.status(201).json({
        message: "APK uploaded and published successfully!",
        apk: newUpload,
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({
        error: "Failed to upload APK",
        details: error.message,
      });
    }
  }
);

// GET: My uploaded APKs (by user ID from frontend or session if available)
router.get("/my-apks", async (req, res) => {
  try {
    // Try to get user ID from query (sent from frontend) or body
    const userId = req.query.user || req.body.user;

    if (!userId) {
      return res.status(401).json({ error: "User ID required" });
    }

    const apks = await UploadApk.find({ user: userId }).sort({ createdAt: -1 });
    res.json(apks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET: All public APKs
router.get("/all-apks", async (req, res) => {
  try {
    const apks = await UploadApk.find({})
      .select("-permissionReason")
      .populate("user", "name email") // Show uploader info
      .sort({ createdAt: -1 });

    res.json(apks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
