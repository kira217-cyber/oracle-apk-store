// backend/models/UploadApk.js
import mongoose from 'mongoose';

const { Schema } = mongoose;

const uploadApkSchema = new Schema(
  {
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
      enum: ['Android', 'iOS', 'Both'],
    },
    apkFile: {
      type: String,
      required: true,
    },
    screenshots: {
      type: [String],
      required: true,
      validate: {
        validator: function (val) {
          return val.length >= 4 && val.length <= 12;
        },
        message: 'Screenshots must be between 4 and 12',
      },
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
        validator: function (val) {
          return val.length >= 5;
        },
        message: 'Minimum 5 tags required',
      },
    },
    fullAbout: {
      type: String,
      required: true,
    },
    collectsUserData: {
      type: String,
      enum: ['Yes', 'No'],
      required: true,
    },
    bettingOrGambling: {
      type: String,
      enum: ['Yes', 'No'],
      required: true,
    },
    earningOrAds: {
      type: String,
      enum: ['Yes', 'No'],
      required: true,
    },
    mobileBanking: {
      type: String,
      enum: ['Yes', 'No'],
      required: true,
    },
    government: {
      type: String,
      enum: ['Yes', 'No'],
      required: true,
    },
    sharesDataWithThirdParties: {
      type: String,
      enum: ['Yes', 'No'],
      required: true,
    },
    intendedForChildren: {
      type: String,
      enum: ['Yes', 'No', 'Both'],
      required: true,
    },
    childDataTypes: {
      type: [String],
      default: [],
    },
    purposeOfDataCollection: {
      type: [String],
      default: [],
    },
    dataSharedWith: {
      type: [String],
      default: [],
    },
    dataProtection: {
      type: [String],
      default: [],
    },
    dataRetention: {
      type: [String],
      default: [],
    },
    userControls: {
      type: [String],
      default: [],
    },
    childCompliance: {
      type: [String],
      default: [],
    },
    sensitivePermissions: {
      type: [String],
      default: [],
    },
    permissionReason: {
      type: String,
      default: '',
    },
    showsAds: {
      type: String,
      enum: ['Yes', 'No'],
      required: true,
    },
    adDetails: {
      type: [String],
      default: [],
    },
    supportContact: {
      type: String,
      required: true,
      trim: true,
    },
    declarations: {
      type: [String],
      required: true,
      validate: {
        validator: function (val) {
          return val.length === 4;
        },
        message: 'All 4 declarations must be checked',
      },
    },

    // Reference to the authenticated user who uploaded this APK
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// Index for faster queries by user
uploadApkSchema.index({ user: 1 });

// Create and export the model
const UploadApk = mongoose.model('UploadApk', uploadApkSchema);

export default UploadApk;