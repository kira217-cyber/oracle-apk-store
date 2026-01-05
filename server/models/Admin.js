// models/Admin.js
import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Method to compare password (used in login)
adminSchema.methods.comparePassword = async function (candidatePassword) {
  throw new Error("comparePassword must be implemented in route");
};

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;