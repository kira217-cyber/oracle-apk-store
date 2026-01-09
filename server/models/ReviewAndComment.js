// Backend: models/ReviewAndComment.js
import mongoose from "mongoose";

const { Schema } = mongoose;

const reviewSchema = new Schema({
  appId: { type: Schema.Types.ObjectId, ref: "UploadApk", required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String },
  helpful: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Review", reviewSchema);
