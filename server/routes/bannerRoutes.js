import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import Banner from "../models/Banner.js";

const router = express.Router();

// Ensure uploads directory exists
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("Created uploads folder");
}

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Save directly to 'uploads/'
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

// File filter: Only allow images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|avif/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit per file
  fileFilter,
}).fields([
  { name: "app_image", maxCount: 1 },
  { name: "bg_image", maxCount: 1 },
]);

// CREATE Banner
router.post("/", (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error("Multer error:", err.message);
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return res
            .status(400)
            .json({ error: "File too large. Max 5MB allowed." });
        }
        return res.status(400).json({ error: err.message });
      }
      return res
        .status(500)
        .json({ error: "Image upload failed: " + err.message });
    }

    try {
      const { title, subtitle, app_url } = req.body;

      // Check if files were actually uploaded
      if (!req.files || !req.files.app_image || !req.files.bg_image) {
        return res
          .status(400)
          .json({ error: "Both app_image and bg_image are required" });
      }

      const app_image = `/uploads/${req.files.app_image[0].filename}`;
      const bg_image = `/uploads/${req.files.bg_image[0].filename}`;

      const banner = new Banner({
        title,
        subtitle,
        app_url,
        app_image,
        bg_image,
      });

      await banner.save();
      res.status(201).json(banner);
    } catch (error) {
      console.error("Save error:", error);
      res.status(400).json({ error: error.message });
    }
  });
});

// GET All Banners
router.get("/", async (req, res) => {
  try {
    const banners = await Banner.find();
    res.json(banners);
  } catch (error) {
    console.error("GET error:", error);
    res.status(500).json({ error: error.message });
  }
});

// UPDATE Banner
router.put("/:id", (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error("Multer error (update):", err.message);
      return res
        .status(500)
        .json({ error: "Image upload failed: " + err.message });
    }

    try {
      const { title, subtitle, app_url } = req.body;
      const updateData = { title, subtitle, app_url };

      if (req.files?.app_image) {
        updateData.app_image = `/uploads/${req.files.app_image[0].filename}`;
      }
      if (req.files?.bg_image) {
        updateData.bg_image = `/uploads/${req.files.bg_image[0].filename}`;
      }

      const banner = await Banner.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
      });

      if (!banner) {
        return res.status(404).json({ error: "Banner not found" });
      }

      res.json(banner);
    } catch (error) {
      console.error("Update error:", error);
      res.status(400).json({ error: error.message });
    }
  });
});

// DELETE Banner
router.delete("/:id", async (req, res) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);

    if (!banner) {
      return res.status(404).json({ error: "Banner not found" });
    }

    // Optional: Delete image files from disk
    const deleteFile = (filePath) => {
      const fullPath = path.join(process.cwd(), filePath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    };

    deleteFile(banner.app_image);
    deleteFile(banner.bg_image);

    res.json({ message: "Banner deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
