import mongoose from "mongoose";
const { Schema } = mongoose;

const uploadApkSchema = new Schema(
  {
    apk_Id: {
      type: String,
      unique: true,
      index: true,
    },

    apkTitle: {
      type: String,
      required: true,
      trim: true,
    },
    appCategory: {
      type: String,
      required: true,
      trim: true,
    },
    shortDescription: {
      type: String,
      required: true,
      trim: true,
    },
    apkLogo: {
      type: String,
      required: true,
    },
    requiresGoogleRestrictions: {
      type: Boolean,
      default: false,
    },
    uploadVideo: {
      type: String,
      default: null,
    },
    appPlatform: {
      type: String,
      required: true,
      enum: ["Android", "iOS", "Both"],
    },
    apkFile: {
      type: String,
      required: true,
    },
    screenshots: {
      type: [String],
      required: true,
      validate: {
        validator: (val) => val.length >= 4 && val.length <= 12,
        message: "Screenshots must be between 4 and 12",
      },
    },
    websiteUrl: {
      type: String,
      trim: true,
    },
    apkVersion: {
      type: String,
      required: true,
      trim: true,
    },
    tags: {
      type: [String],
      required: true,
      validate: {
        validator: (val) => val.length >= 5,
        message: "Minimum 5 tags required",
      },
    },
    fullAbout: {
      type: String,
      required: true,
    },
    collectsUserData: {
      type: String,
      enum: ["Yes", "No"],
      required: true,
    },
    bettingOrGambling: {
      type: String,
      enum: ["Yes", "No"],
      required: true,
    },
    earningOrAds: {
      type: String,
      enum: ["Yes", "No"],
      required: true,
    },
    mobileBanking: {
      type: String,
      enum: ["Yes", "No"],
      required: true,
    },
    government: {
      type: String,
      enum: ["Yes", "No"],
      required: true,
    },
    sharesDataWithThirdParties: {
      type: String,
      enum: ["Yes", "No"],
      required: true,
    },
    intendedForChildren: {
      type: String,
      enum: ["Yes", "No", "Both"],
      required: true,
    },
    childDataTypes: { type: [String], default: [] },
    purposeOfDataCollection: { type: [String], default: [] },
    dataSharedWith: { type: [String], default: [] },
    dataProtection: { type: [String], default: [] },
    dataRetention: { type: [String], default: [] },
    userControls: { type: [String], default: [] },
    childCompliance: { type: [String], default: [] },
    sensitivePermissions: { type: [String], default: [] },
    permissionReason: { type: String, default: "" },
    showsAds: {
      type: String,
      enum: ["Yes", "No"],
      required: true,
    },
    adDetails: { type: [String], default: [] },
    supportContact: {
      type: String,
      required: true,
      trim: true,
    },
    declarations: {
      type: [String],
      required: true,
      validate: {
        validator: (val) => val.length === 4,
        message: "All 4 declarations must be checked",
      },
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "Developer",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "active", "deactive", "rejected"],
      default: "pending",
    },
    adminMessage: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

// Indexes
uploadApkSchema.index({ user: 1 });
uploadApkSchema.index({ status: 1 });
uploadApkSchema.index({ apk_Id: 1 });

const UploadApk = mongoose.model("UploadApk", uploadApkSchema);
export default UploadApk;
