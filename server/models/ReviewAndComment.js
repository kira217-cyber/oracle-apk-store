import mongoose from "mongoose";

const { Schema } = mongoose;

const reviewSchema = new Schema(
  {
    // Reference to the APK being reviewed
    apk_Id: {
      type: Schema.Types.ObjectId, // Must be ObjectId
      ref: "UploadApk", // Refers to the APK model
      required: true,
      index: true, // Optional: makes querying faster
    },

    // Reference to the user who submitted the review
    userId: {
      type: Schema.Types.ObjectId, // Must be ObjectId
      ref: "User", // Refers to the User model
      required: true,
    },

    // Rating value
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    // Optional text review
    comment: {
      type: String,
      trim: true,
    },

    // Helpful count
    helpful: {
      type: Number,
      default: 0,
    },

    // Track users who marked as helpful
    helpfulBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

// Ensure 1 user can submit only 1 review per APK
reviewSchema.index({ apk_Id: 1, userId: 1 }, { unique: true });

export default mongoose.model("Review", reviewSchema);
