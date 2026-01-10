import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import AdsPromotionTwo from "../models/AdsPromotionTwo.js";

const router = express.Router();

const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9) + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp|avif/;
  const extOk = allowed.test(path.extname(file.originalname).toLowerCase());
  const mimeOk = allowed.test(file.mimetype);
  cb(null, extOk && mimeOk);
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
}).single("image");

// CREATE
router.post("/", (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ error: err.message });

    try {
      if (!req.file) return res.status(400).json({ error: "Image is required" });

      const { app_id } = req.body;
      const imagePath = `/uploads/${req.file.filename}`;

      const promotion = new AdsPromotionTwo({ app_id, image: imagePath });
      await promotion.save();

      res.status(201).json(promotion);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
});

// GET ALL
router.get("/", async (req, res) => {
  try {
    const promotions = await AdsPromotionTwo.find().sort({ createdAt: -1 });
    res.json(promotions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE
router.put("/:id", (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ error: err.message });

    try {
      const updateData = { app_id: req.body.app_id };

      if (req.file) {
        updateData.image = `/uploads/${req.file.filename}`;
      }

      const updated = await AdsPromotionTwo.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );

      if (!updated) return res.status(404).json({ error: "Not found" });
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
});

// DELETE
router.delete("/:id", async (req, res) => {
  try {
    const promotion = await AdsPromotionTwo.findByIdAndDelete(req.params.id);
    if (!promotion) return res.status(404).json({ error: "Not found" });

    // Optional: delete file
    if (promotion.image) {
      const filePath = path.join(process.cwd(), promotion.image);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;