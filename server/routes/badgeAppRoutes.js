import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import BadgeApp from "../models/BadgeApp.js";

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
}).fields([{ name: "image", maxCount: 1 }]);

// CREATE Badge App
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
      const { badge_name, app_id } = req.body;

      // Check if files were actually uploaded
      if (!req.files || !req.files.image) {
        return res.status(400).json({ error: "Image is required" });
      }

      const image = `/uploads/${req.files.image[0].filename}`;

      const badge = new BadgeApp({
        badge_name,
        app_id,
        image,
      });

      await badge.save();
      res.status(201).json(badge);
    } catch (error) {
      console.error("Save error:", error);
      res.status(400).json({ error: error.message });
    }
  });
});

// GET All Badge Apps
router.get("/", async (req, res) => {
  try {
    const badges = await BadgeApp.find();
    res.json(badges);
  } catch (error) {
    console.error("GET error:", error);
    res.status(500).json({ error: error.message });
  }
});

// UPDATE Badge App
router.put("/:id", (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error("Multer error (update):", err.message);
      return res
        .status(500)
        .json({ error: "Image upload failed: " + err.message });
    }

    try {
      const { badge_name, app_id } = req.body;
      const updateData = { badge_name, app_id };

      if (req.files?.image) {
        updateData.image = `/uploads/${req.files.image[0].filename}`;
      }

      const badge = await BadgeApp.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          new: true,
        }
      );

      if (!badge) {
        return res.status(404).json({ error: "Badge App not found" });
      }

      res.json(badge);
    } catch (error) {
      console.error("Update error:", error);
      res.status(400).json({ error: error.message });
    }
  });
});

// DELETE Badge App
router.delete("/:id", async (req, res) => {
  try {
    const badge = await BadgeApp.findByIdAndDelete(req.params.id);

    if (!badge) {
      return res.status(404).json({ error: "Badge App not found" });
    }

    // Optional: Delete image file from disk
    const deleteFile = (filePath) => {
      const fullPath = path.join(process.cwd(), filePath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    };

    deleteFile(badge.image);

    res.json({ message: "Badge App deleted successfully" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
