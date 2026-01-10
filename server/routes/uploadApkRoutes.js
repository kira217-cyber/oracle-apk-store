// backend/routes/uploadApkRoutes.js
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import UploadApk from "../models/UploadApk.js";
import Developer from "../models/Developer.js";
import { sendEmail } from "../config/email.js";

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

// Helper function
const generateApkId = (apkTitle) => {
  const slug = apkTitle
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

  const randomNumber = Math.floor(100000 + Math.random() * 900000);
  return `${slug}-${randomNumber}`;
};

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

      const userIdFromFrontend = data.user;
      if (!userIdFromFrontend) {
        return res.status(401).json({
          error: "User not authenticated. Please log in.",
        });
      }

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
          data[field] = JSON.parse(data[field]);
        } else {
          data[field] = [];
        }
      });

      // File paths
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

      // Validation
      if (!data.apkLogo)
        return res.status(400).json({ error: "APK Logo is required" });
      if (!data.apkFile)
        return res.status(400).json({ error: "APK File is required" });
      if (data.screenshots.length < 4 || data.screenshots.length > 12)
        return res
          .status(400)
          .json({ error: "Must upload between 4 and 12 screenshots" });
      if (data.tags.length < 5)
        return res.status(400).json({ error: "Minimum 5 tags required" });
      if (data.declarations.length !== 4)
        return res
          .status(400)
          .json({ error: "All 4 declarations must be checked" });

      // 🔥 Generate apk_Id
      data.apk_Id = generateApkId(data.apkTitle);

      const newUpload = new UploadApk(data);
      await newUpload.save();

      res.status(201).json({
        message: "APK uploaded successfully!",
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


// GET: Single APK by apk_Id
router.get("/apk/:apkId", async (req, res) => {
  try {
    const { apkId } = req.params;

    const apk = await UploadApk.findOne({ apk_Id: apkId })
      .select("-permissionReason")
      .populate("user", "name email");

    if (!apk) {
      return res.status(404).json({ message: "APK not found" });
    }

    res.json(apk);
  } catch (error) {
    console.error("Fetch APK error:", error);
    res.status(500).json({ error: error.message });
  }
});

// GET: Admin - All APKs with search and filter
router.get("/admin/apks", async (req, res) => {
  try {
    const { search = "", status = "pending" } = req.query;

    let query = {};

    if (status && status !== "all") {
      query.status = status;
    }

    if (search.trim()) {
      const developers = await Developer.find({
        $or: [
          { email: { $regex: search, $options: "i" } },
          { fullName: { $regex: search, $options: "i" } },
          { companyName: { $regex: search, $options: "i" } },
        ],
      }).select("_id");

      const developerIds = developers.map((d) => d._id);

      query.$or = [
        { apkTitle: { $regex: search, $options: "i" } },
        { user: { $in: developerIds } },
      ];
    }

    const apks = await UploadApk.find(query)
      .populate({
        path: "user",
        select: "fullName email companyName country whatsapp status createdAt",
      })
      .sort({ createdAt: -1 });

    res.json(apks);
  } catch (error) {
    console.error("Error fetching APKs:", error);
    res.status(500).json({ error: error.message });
  }
});

// POST: Admin - Update status (with message and email)
router.post("/admin/update-status/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status, message } = req.body; // status: 'active'|'deactive'|'rejected'|'approved'

    if (!["active", "deactive", "rejected", "approved"].includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const apk = await UploadApk.findById(id).populate("user", "email name");
    if (!apk) {
      return res.status(404).json({ error: "APK not found" });
    }

    const oldStatus = apk.status;
    apk.status = status === "approved" ? "active" : status; // approved → active
    apk.adminMessage = message || "";

    await apk.save();

    // Send email to developer
    if (apk.user && apk.user.email) {
      let subject = "";
      let text = `Hello ${apk.user.name || "Developer"},\n\nYour app "${
        apk.apkTitle
      }" status has been updated.\nNew Status: ${apk.status.toUpperCase()}\n`;

      if (message) {
        text += `\nAdmin Message: ${message}\n`;
      }

      if (status === "active" || status === "approved") {
        subject = "Your App Has Been Approved & Activated!";
      } else if (status === "deactive") {
        subject = "Your App Has Been Deactivated";
      } else if (status === "rejected") {
        subject = "Your App Submission Has Been Rejected";
      }

      await sendEmail(apk.user.email, subject, text);
    }

    res.json({ message: "Status updated and email sent", apk });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// GET: My uploaded APKs
router.get("/my-apks", async (req, res) => {
  const userId = req.query.user;
  if (!userId) return res.status(401).json({ error: "User ID required" });

  const apks = await UploadApk.find({ user: userId }).sort({ createdAt: -1 });
  res.json(apks);
});

export default router;
