import mongoose from 'mongoose';

const badgeAppSchema = new mongoose.Schema(
  {
    badge_name: {
      type: String,
      required: true,
    },
    app_id: {
      type: String,
      required: true,
    },
    image: {
      type: String, // e.g., /uploads/filename.jpg
      required: true,
    },
  },
  { timestamps: true }
);

const BadgeApp = mongoose.model('BadgeApp', badgeAppSchema);

export default BadgeApp;