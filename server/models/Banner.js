import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      required: true,
    },
    app_url: {
      type: String,
      required: true,
    },
    app_image: {
      type: String, // e.g., /uploads/filename.jpg
      required: true,
    },
    bg_image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Banner = mongoose.model('Banner', bannerSchema);

export default Banner;