import mongoose from "mongoose";

const { Schema } = mongoose;

const reviewSchema = new Schema(
  {
    apk_Id: {
      type: Schema.Types.ObjectId,
      ref: "UploadApk",
      required: true,
      index: true,
    },

    // এখন required না — অ্যাডমিন fake review-এ null হতে পারে
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: false, // ← এখানে পরিবর্তন
      index: true,
    },

    // নতুন ফিল্ড — শুধু fake review-এর জন্য
    fakeUserName: {
      type: String,
      trim: true,
      maxlength: 100,
      default: null,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    comment: {
      type: String,
      trim: true,
    },

    helpful: {
      type: Number,
      default: 0,
    },

    helpfulBy: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // অপশনাল: অ্যাডমিন যদি চায় তাহলে কে তৈরি করেছে সেটা ট্র্যাক করতে
    createdByAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// ইউনিক ইনডেক্স — শুধু আসল ইউজারের ক্ষেত্রে (userId null হলে ডুপ্লিকেট চেক করবে না)
reviewSchema.index(
  { apk_Id: 1, userId: 1 },
  {
    unique: true,
    partialFilterExpression: { userId: { $exists: true, $ne: null } },
  }
);

export default mongoose.model("Review", reviewSchema);
