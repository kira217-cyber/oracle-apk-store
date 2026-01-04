import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
  },
  { timestamps: true }
);

// কোনো pre-save hook নেই → পাসওয়ার্ড হ্যাশ হবে না
// কোনো comparePassword মেথড নেই

export default mongoose.model("User", userSchema);
