import mongoose from "mongoose";
const developerSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    accountType: { type: String, required: true }, // company or individual
    companyName: { type: String },
    fullName: { type: String },
    country: { type: String },
    whatsapp: { type: String },
    website: { type: String },
    password: { type: String, required: true },
    role: { type: String, default: "developer" }, // always developer
    status: {
      type: String,
      enum: ["pending", "active", "deactive", "rejected"],
      default: "active",
    },
  },
  { timestamps: true }
);
const Developer = mongoose.model("Developer", developerSchema);
export default Developer;
