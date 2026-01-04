import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import developerRoutes from "./routes/developerRoutes.js"

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

connectDB();

app.use("/api/users", userRoutes);
app.use("/api/developer", developerRoutes);

app.get("/", (req, res) => {
  res.send("Apk Store Server Running...");
});

const port = process.env.PORT || 5005;
app.listen(port, () => console.log(`Server running on port ${port}`));
