import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import compression from "compression";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import prerender from "prerender-node";

import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import developerRoutes from "./routes/developerRoutes.js";
import uploadApkRoutes from "./routes/uploadApkRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import categoriesRouter from "./routes/categoriesRoutes.js";
import bannerRoutes from "./routes/bannerRoutes.js";
import reviewAndCommentRoutes from "./routes/reviewAndCommentRoutes.js";
import popularRoutes from "./routes/popularRoutes.js";
import adsPromotionOneRoutes from "./routes/adsPromotionOneRoutes.js";
import adsPromotionTwoRoutes from "./routes/adsPromotionTwoRoutes.js";
import badgeAppRoutes from "./routes/badgeAppRoutes.js";
import mostDownloadRoutes from "./routes/mostDownloadRoutes.js";

import UploadApk from "./models/UploadApk.js";

dotenv.config();

const app = express();

/* ================================
   🔥 PRERENDER MIDDLEWARE (TOP)
   ================================ */
app.use(
  prerender
    .set("prerenderToken", process.env.PRERENDER_TOKEN)
    .set("protocol", "https")
);

/* ================================
   BASIC MIDDLEWARE
   ================================ */
app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ================================
   STATIC UPLOADS
   ================================ */
app.use("/uploads", express.static("uploads"));

/* ================================
   DATABASE
   ================================ */
connectDB();

/* ================================
   API ROUTES
   ================================ */
app.use("/api/users", userRoutes);
app.use("/api/developer", developerRoutes);
app.use("/api", uploadApkRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/categories", categoriesRouter);
app.use("/api/banners", bannerRoutes);
app.use("/api/reviews", reviewAndCommentRoutes);
app.use("/api/popular", popularRoutes);
app.use("/api/ads-promotion-one", adsPromotionOneRoutes);
app.use("/api/ads-promotion-two", adsPromotionTwoRoutes);
app.use("/api/badge-app", badgeAppRoutes);
app.use("/api/most-download", mostDownloadRoutes);

/* ================================
   FRONTEND (VITE BUILD)
   ================================ */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const frontendDist = path.resolve(__dirname, "../client/dist");

let indexHtml = "";
try {
  indexHtml = fs.readFileSync(
    path.join(frontendDist, "index.html"),
    "utf-8"
  );
} catch (err) {
  console.error("❌ client/dist/index.html not found");
  console.error("👉 Run: cd client && npm run build");
  process.exit(1);
}

app.use(express.static(frontendDist));

/* ================================
   META API (OPTIONAL)
   ================================ */
app.get("/apk-meta/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const apk = await UploadApk.findOne({ apk_Id: id }).lean();

    if (!apk) return res.status(404).json({ error: "Not found" });

    const baseUrl = process.env.BASE_URL || "http://localhost:5005";

    res.json({
      metaTitle: `${apk.apkTitle} - Download APK | Your APK Store BD`,
      metaDescription:
        apk.shortDescription ||
        apk.fullAbout?.substring(0, 158) + "..." ||
        "Download latest Android APK safely",
      metaImage: apk.apkLogo
        ? `${baseUrl}${apk.apkLogo}`
        : `${baseUrl}/default-og.jpg`,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

/* ================================
   CATCH-ALL (IMPORTANT)
   ================================ */
app.get("/*all", (req, res) => {
  res.send(indexHtml);
});

/* ================================
   SERVER START
   ================================ */
const port = process.env.PORT || 5005;
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
  console.log(`📦 Frontend served from: ${frontendDist}`);
});
