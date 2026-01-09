import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import developerRoutes from "./routes/developerRoutes.js";
import uploadApkRoutes from "./routes/uploadApkRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import categoriesRouter from './routes/categoriesRoutes.js';
import bannerRoutes from './routes/bannerRoutes.js';
import reviewAndCommentRoutes from './routes/reviewAndCommentRoutes.js';


dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

connectDB();

app.use("/api/users", userRoutes);
app.use("/api/developer", developerRoutes);
app.use("/api", uploadApkRoutes);
app.use("/api/admin", adminRoutes);
app.use('/api/categories', categoriesRouter);
app.use('/api/banners', bannerRoutes);
app.use("/api/reviews", reviewAndCommentRoutes);


app.get("/", (req, res) => {
  res.send("Apk Store Server Running...");
});

const port = process.env.PORT || 5005;
app.listen(port, () => console.log(`Server running on port ${port}`));
